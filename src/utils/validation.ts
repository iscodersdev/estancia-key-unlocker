
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cardRegex = /^\d+$/;
  return cardRegex.test(cardNumber);
};
