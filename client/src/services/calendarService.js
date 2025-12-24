import api from "./api";

const calendarService = {
  // 월별 일정 조회
  getEventsByMonth: async (year, month) => {
    const response = await api.get("/calendar-events", {
      params: { year, month },
    });
    return response.data;
  },

  // 일정 상세 조회
  getEventById: async (eventId) => {
    const response = await api.get(`/calendar-events/${eventId}`);
    return response.data;
  },

  // 일정 등록
  createEvent: async (eventData) => {
    const response = await api.post("/calendar-events", eventData);
    return response.data;
  },

  // 일정 수정
  updateEvent: async (eventId, eventData) => {
    const response = await api.patch(`/calendar-events/${eventId}`, eventData);
    return response.data;
  },

  // 일정 삭제
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/calendar-events/${eventId}`);
    return response.data;
  },
};

export default calendarService;
