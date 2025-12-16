import api from './api';

const dictionaryService = {
  getAnimals: async (category = 'all') => {
    const response = await api.get('/dictionary', { params: { category } });
    return response.data;
  },

  getAnimalById: async (id) => {
    const response = await api.get(`/dictionary/${id}`);
    return response.data;
  },

  searchAnimals: async (query) => {
    const response = await api.get('/dictionary/search', { params: { q: query } });
    return response.data;
  },
};

export default dictionaryService;
