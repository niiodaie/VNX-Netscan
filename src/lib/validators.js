// Form validation utilities for VisPrint

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? '' : 'Please enter a valid email address'
  };
}

export function validateRequired(value, fieldName = 'This field') {
  const isValid = value && value.toString().trim().length > 0;
  return {
    isValid,
    message: isValid ? '' : `${fieldName} is required`
  };
}

export function validateMinLength(value, minLength, fieldName = 'This field') {
  const isValid = value && value.toString().length >= minLength;
  return {
    isValid,
    message: isValid ? '' : `${fieldName} must be at least ${minLength} characters`
  };
}

export function validateMaxLength(value, maxLength, fieldName = 'This field') {
  const isValid = !value || value.toString().length <= maxLength;
  return {
    isValid,
    message: isValid ? '' : `${fieldName} must be no more than ${maxLength} characters`
  };
}

export function validatePhone(phone) {
  // Simple phone validation - accepts various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  
  return {
    isValid: phoneRegex.test(cleanPhone),
    message: phoneRegex.test(cleanPhone) ? '' : 'Please enter a valid phone number'
  };
}

export function validateQuantity(quantity, minQuantity = 1, maxQuantity = 10000) {
  const num = parseInt(quantity);
  const isValid = !isNaN(num) && num >= minQuantity && num <= maxQuantity;
  
  return {
    isValid,
    message: isValid ? '' : `Quantity must be between ${minQuantity} and ${maxQuantity}`
  };
}

export function validateFileSize(file, maxSizeMB = 10) {
  if (!file) return { isValid: true, message: '' };
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const isValid = file.size <= maxSizeBytes;
  
  return {
    isValid,
    message: isValid ? '' : `File size must be less than ${maxSizeMB}MB`
  };
}

export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']) {
  if (!file) return { isValid: true, message: '' };
  
  const isValid = allowedTypes.includes(file.type);
  
  return {
    isValid,
    message: isValid ? '' : `File type must be one of: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`
  };
}

export function validateContactForm(formData) {
  const errors = {};
  
  const nameValidation = validateRequired(formData.name, 'Name');
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  const messageValidation = validateRequired(formData.message, 'Message');
  if (!messageValidation.isValid) {
    errors.message = messageValidation.message;
  }
  
  const messageLengthValidation = validateMinLength(formData.message, 10, 'Message');
  if (!messageLengthValidation.isValid) {
    errors.message = messageLengthValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateQuoteForm(formData) {
  const errors = {};
  
  const nameValidation = validateRequired(formData.name, 'Name');
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

