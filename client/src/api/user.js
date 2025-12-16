import axios from "./axios";

// 회원가입 API
export const signup = async (userid, email, password) => {
  const response = await axios.post("/users", {
    userid,
    email,
    password,
  });

  return response.data;
};
