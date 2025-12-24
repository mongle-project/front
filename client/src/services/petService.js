import api from "./api";

const petService = {
  // 내 반려동물 목록 조회
  getMyPets: async () => {
    const response = await api.get("/pets");
    return response.data;
  },

  // 반려동물 상세 조회
  getPetById: async (petId) => {
    const response = await api.get(`/pets/${petId}`);
    return response.data;
  },

  // 반려동물 등록
  createPet: async (formData) => {
    const response = await api.post("/pets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 반려동물 수정
  updatePet: async (petId, formData) => {
    const response = await api.put(`/pets/${petId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 반려동물 삭제
  deletePet: async (petId) => {
    const response = await api.delete(`/pets/${petId}`);
    return response.data;
  },
};

export default petService;
