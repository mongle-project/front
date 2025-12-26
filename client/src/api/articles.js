import axios from "./axios";
// 게시글 목록 조회
export const getArticles = async (params = {}) => {
  // params 예: { page, limit, category, sort, keyword }
  const response = await axios.get("/articles", { params });
  return response.data;
};
// 내가 작성한 게시글 목록 조회
export const getMyArticles = async (limit = 20, offset = 0) => {
  const response = await axios.get(
    `/articles/me/my-articles?limit=${limit}&offset=${offset}`
  );
  return response.data;
};
// 게시글 상세 조회
export const getArticleById = async (id) => {
  const response = await axios.get(`/articles/${id}`);
  return response.data;
};
// 게시글 작성
export const createArticle = async (formData) => {
  const response = await axios.post("/articles", formData);
  return response.data;
};
// 게시글 수정
export const updateArticle = async (id, formData) => {
  const response = await axios.patch(`/articles/${id}`, formData);
  return response.data;
};
// 게시글 삭제
export const deleteArticle = async (id) => {
  const response = await axios.delete(`/articles/${id}`);
  return response.data;
};
// 좋아요 토글
export const toggleLike = async (id) => {
  const response = await axios.post(`/articles/${id}/likes`);
  return response.data;
};
// 북마크 토글
export const toggleBookmark = async (id) => {
  const response = await axios.post(`/articles/${id}/bookmarks`);
  return response.data;
};

// 북마크한 게시글 목록 조회
export const getBookmarkedArticles = async (limit = 20, offset = 0) => {
  const response = await axios.get(
    `/articles/me/bookmarked?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

// 신고
export const reportArticle = async (id) => {
  const response = await axios.post(`/articles/${id}/reports`);
  return response.data;
};
