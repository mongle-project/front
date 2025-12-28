export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR');
};

export const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('ko-KR');
};

export const formatDateTimeCompact = (date) => {
  if (!date) return '';

  // Date 객체로 변환
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const pad = (num) => String(num).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());

  return `${year}-${month}-${day} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
};

export const getDaysUntil = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

export const isPast = (date) => {
  const now = new Date();
  const d = new Date(date);
  return d < now;
};

/**
 * 날짜와 시간을 읽기 쉬운 형식으로 포맷
 * @param {string|Date} dateString - 날짜 문자열 또는 Date 객체
 * @returns {string} 예: "2025.12.28 (토) 오후 3:57"
 */
export const formatDateTimeReadable = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;

  return `${year}.${month}.${day} (${weekday}) ${ampm} ${displayHours}:${minutes}`;
};

/**
 * 날짜만 읽기 쉬운 형식으로 포맷 (YYYY-MM-DD 문자열용, 타임존 안전)
 * @param {string} dateString - YYYY-MM-DD 형식 문자열
 * @returns {string} 예: "12월 28일 (토)"
 */
export const formatDateLabel = (dateString) => {
  if (!dateString) return '';

  // YYYY-MM-DD 형식을 로컬 타임존으로 파싱
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return '';

  const dateObj = new Date(year, month - 1, day);
  if (Number.isNaN(dateObj.getTime())) return '';

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[dateObj.getDay()];

  return `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${weekday})`;
};

/**
 * 시간을 읽기 쉬운 형식으로 포맷
 * @param {string} timeString - HH:MM 또는 HH:MM:SS 형식 문자열
 * @returns {string} 예: "오후 3:57"
 */
export const formatTimeReadable = (timeString) => {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  if (Number.isNaN(hour)) return '';

  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${period} ${displayHour}:${minutes}`;
};
