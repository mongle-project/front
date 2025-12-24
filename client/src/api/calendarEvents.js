import axios from "./axios";

// 일정 등록
export const createCalendarEvent = async ({
  petProfileId,
  eventDate,
  category,
  content,
}) => {
  const response = await axios.post("/calendar-events", {
    petProfileId,
    eventDate,
    category,
    content,
  });
  return response.data;
};

// 월별 일정 조회
export const getMonthlyCalendarEvents = async ({ year, month }) => {
  const response = await axios.get("/calendar-events", {
    params: { year, month },
  });
  return response.data;
};

// 일정 상세 조회
export const getCalendarEventById = async (eventId) => {
  const response = await axios.get(`/calendar-events/${eventId}`);
  return response.data;
};

// 일정 수정
export const updateCalendarEvent = async (eventId, { content, isComplete }) => {
  const response = await axios.patch(`/calendar-events/${eventId}`, {
    content,
    isComplete,
  });
  return response.data;
};

// 일정 삭제
export const deleteCalendarEvent = async (eventId) => {
  await axios.delete(`/calendar-events/${eventId}`);
  return true;
};
