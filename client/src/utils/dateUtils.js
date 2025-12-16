export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR');
};

export const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('ko-KR');
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
