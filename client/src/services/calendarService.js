import api from './api';

const calendarService = {
  getEvents: async () => {
    const response = await api.get('/calendar/events');
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/calendar/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/calendar/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/calendar/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/calendar/events/${id}`);
    return response.data;
  },
};

export default calendarService;
