import axios from "./axios";

// AI 건강 상담 (AI 응답 생성 시간이 오래 걸릴 수 있어 timeout을 60초로 설정)
export const aiHealthConsult = async (consultData) => {
  const response = await axios.post("/health/consult", consultData, {
    timeout: 60000, // 60초
  });
  return response.data;
};
