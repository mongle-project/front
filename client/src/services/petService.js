import api from './api';

const petService = {
  getPets: async () => {
    const response = await api.get('/pets');
    return response.data;
  },

  getPetById: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  createPet: async (petData) => {
    const response = await api.post('/pets', petData);
    return response.data;
  },

  updatePet: async (id, petData) => {
    const response = await api.put(`/pets/${id}`, petData);
    return response.data;
  },

  deletePet: async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  },
};

export default petService;
