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
  { value: 'rabbit', label: '토끼', icon: '🐰' },
  { value: 'hamster', label: '햄스터', icon: '🐹' },
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
  {
    // 기존 데이터/백엔드에서 넘어오는 레거시 카테고리 대비
    small: '소동물',
    guineapig: '기니피그',
    'guinea pig': '기니피그',
    turtle: '거북이',
  }
);

export const COMMUNITY_CATEGORY_SET = new Set(
  COMMUNITY_CATEGORIES.map((category) => category.value).concat([
    // 레거시 호환용
    'small',
    'guineapig',
    'guinea pig',
    'turtle',
  ])
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
