import axios from "./axios";

// 로그인 API
export const login = async (userid, password) => {
  const response = await axios.post("/auth/login", {
    userid,
    password,
  });
  return response.data;
};

// 회원가입 API (추후 명세에 맞게 수정)
export const signup = async (userid, email, password) => {
  const response = await axios.post("/auth/signup", {
    userid,
    email,
    password,
  });
  return response.data;
};

// 로그아웃 API (필요시)
export const logout = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};
