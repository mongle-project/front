import axios from "./axios";

// 병원 목록 조회
export const getHospitals = async (params = {}) => {
  const response = await axios.get("/hospitals", { params });
  return response.data;
};

// 병원 상세 조회
export const getHospitalById = async (hospitalId) => {
  const response = await axios.get(`/hospitals/${hospitalId}`);
  return response.data;
};

// 보호소 목록 조회
export const getShelters = async (params = {}) => {
  const response = await axios.get("/shelters", { params });
  return response.data;
};

// 보호소 상세 조회
export const getShelterById = async (shelterId) => {
  const response = await axios.get(`/shelters/${shelterId}`);
  return response.data;
};
