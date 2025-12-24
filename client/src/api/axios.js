import axios from 'axios';
import config from '../config/config';

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: config.apiUrl, // 백엔드 서버 주소
  timeout: config.apiTimeout, // 요청 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기 (필요시)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData 전송 시 Content-Type 헤더 삭제 (브라우저가 자동으로 multipart/form-data 설정)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버가 응답을 보냈지만 상태 코드가 2xx 범위를 벗어남
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못함
      console.error('Request error:', error.request);
    } else {
      // 요청 설정 중에 문제가 발생함
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
