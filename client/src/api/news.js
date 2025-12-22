import axios from "./axios";

// 뉴스 목록 조회 (캐시에서)
export const getNewsList = async () => {
  const response = await axios.get("/news");
  return response.data;
};