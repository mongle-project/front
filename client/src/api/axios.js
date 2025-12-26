import axios from 'axios';
import toast from 'react-hot-toast';
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

    // FormData일 때는 Content-Type을 삭제하여 브라우저가 자동으로 multipart/form-data로 설정하도록 함
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
let isRefreshing = false; // refresh token 갱신 중인지 체크
let failedQueue = []; // 대기 중인 요청들

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // refresh token 요청이 401이면 로그아웃
      if (originalRequest.url === '/auth/refresh') {
        const message = '세션이 만료되었습니다. 다시 로그인해주세요.';

        try {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        } catch (storageError) {
          console.error('Failed to clear auth storage:', storageError);
        }

        toast.dismiss('auth-expired');
        toast.error(message, {
          id: 'auth-expired',
          position: 'top-center',
          duration: 2000,
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);

        return Promise.reject(error);
      }

      if (isRefreshing) {
        // refresh가 진행 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // refresh token이 없으면 로그아웃
        const message = '세션이 만료되었습니다. 다시 로그인해주세요.';

        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (storageError) {
          console.error('Failed to clear auth storage:', storageError);
        }

        toast.dismiss('auth-expired');
        toast.error(message, {
          id: 'auth-expired',
          position: 'top-center',
          duration: 2000,
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);

        return Promise.reject(error);
      }

      try {
        // refresh token으로 새 access token 발급
        const response = await instance.post('/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;

        // 새로운 access token 저장
        localStorage.setItem('token', accessToken);

        // 대기 중인 요청들 처리
        processQueue(null, accessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // refresh token도 만료된 경우 로그아웃
        processQueue(refreshError, null);

        const message = '세션이 만료되었습니다. 다시 로그인해주세요.';

        try {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        } catch (storageError) {
          console.error('Failed to clear auth storage:', storageError);
        }

        toast.dismiss('auth-expired');
        toast.error(message, {
          id: 'auth-expired',
          position: 'top-center',
          duration: 2000,
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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
