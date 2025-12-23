import axios from "./axios";

// 반려동물 목록 조회
export const getPets = async () => {
  const response = await axios.get("/pets");
  return response.data;
};

// 반려동물 상세 조회
export const getPetById = async (id) => {
  const response = await axios.get(`/pets/${id}`);
  return response.data;
};

// 반려동물 등록
export const createPet = async (formData) => {
  const response = await axios.post("/pets", formData);
  return response.data;
};

// 반려동물 프로필 수정
export const updatePet = async (id, formData) => {
  const response = await axios.put(`/pets/${id}`, formData);
  return response.data;
};

// 반려동물 프로필 삭제
export const deletePet = async (id) => {
  const response = await axios.delete(`/pets/${id}`);
  return response.data;
};
