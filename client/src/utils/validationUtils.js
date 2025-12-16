export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validatePhoneNumber = (phone) => {
  const re = /^\d{3}-?\d{4}-?\d{4}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.trim() !== '';
};

export const validateLength = (value, min, max) => {
  const length = value.length;
  return length >= min && length <= max;
};
