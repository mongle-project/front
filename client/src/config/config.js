// 환경 변수를 관리하는 설정 파일

const config = {
  // API 기본 URL
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8080",

  // API 타임아웃 (10초)
  apiTimeout: 10000,

  // 기타 설정 추가 가능
  // appName: "몽글몽글",
  // version: "1.0.0",
};

export default config;
