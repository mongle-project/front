import axios from "./axios";

// 로그인 API
export const login = async (userid, password) => {
  const response = await axios.post("/auth/login", {
    userid,
    password,
  });
  return response.data;
};

// 로그아웃 API
export const logout = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};

// Refresh Token API
export const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post("/auth/refresh", {
    refreshToken,
  });
  return response.data;
};
