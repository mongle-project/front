import axios from "./axios";

// 회원가입 API
export const signup = async (userid, email, password, passwordConfirm) => {
  const response = await axios.post("/users", {
    userid,
    email,
    password,
    passwordConfirm,
  });

  return response.data;
};

// 비밀번호 변경 API
export const changePassword = async (currentPassword, newPassword) => {
  const response = await axios.patch("/users/me/password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

// 아이디/이메일 확인 API (비밀번호 재설정용)
export const findUser = async (userid, email) => {
  const response = await axios.post("/users/find-email", {
    userid,
    email,
  });

  return response.data;
};

// 비밀번호 재설정 API
export const resetPassword = async (userid, email, newPassword) => {
  const response = await axios.patch("/users/me/password", {
    userid,
    email,
    newPassword,
  });

  return response.data;
};
