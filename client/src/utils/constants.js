export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PETS: '/pets',
  COMMUNITY: '/community',
  CALENDAR: '/calendar',
  DICTIONARY: '/dictionary',
  MAP: '/map',
  NEWS: '/news',
};
