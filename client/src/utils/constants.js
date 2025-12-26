export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const PET_TYPES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  FISH: 'fish',
  REPTILE: 'reptile',
  OTHER: 'other',
};

export const POST_CATEGORIES = {
  GENERAL: 'general',
  QUESTION: 'question',
  TIPS: 'tips',
  HEALTH: 'health',
  NEWS: 'news',
};

export const EVENT_TYPES = {
  VACCINATION: 'vaccination',
  CHECKUP: 'checkup',
  GROOMING: 'grooming',
  BIRTHDAY: 'birthday',
  MEDICATION: 'medication',
  OTHER: 'other',
};

export const COMMUNITY_CATEGORIES = [
  { value: 'dog', label: '강아지', icon: '🐶' },
  { value: 'cat', label: '고양이', icon: '🐱' },
  { value: 'small', label: '소동물 (토끼/햄스터 등)', icon: '🐹' },
  { value: 'bird', label: '새', icon: '🦜' },
  { value: 'reptile', label: '파충류', icon: '🦎' },
  { value: 'fish', label: '어류', icon: '🐟' },
  { value: 'etc', label: '기타', icon: '✨' },
];

export const COMMUNITY_CATEGORY_LABEL_MAP = COMMUNITY_CATEGORIES.reduce(
  (acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  },
  {}
);

export const COMMUNITY_CATEGORY_SET = new Set(
  COMMUNITY_CATEGORIES.map((category) => category.value)
);

export const DEFAULT_COMMUNITY_CATEGORY = COMMUNITY_CATEGORIES[0].value;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PETS: '/pets',
  PETS_ADD: '/pets/add',
  COMMUNITY: '/community',
  CALENDAR: '/calendar',
  CALENDAR_ADD: '/calendar/add',
  DICTIONARY: '/dictionary',
  MAP: '/map',
  NEWS: '/news',
  HEALTH_CONSULT: '/health/consult',
  HEALTH_RESULT: '/health/result',
};
