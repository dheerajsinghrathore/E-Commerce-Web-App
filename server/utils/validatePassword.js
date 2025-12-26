/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters long
 * - Contains at least one letter (a-z or A-Z)
 * - Contains at least one number (0-9)
 * - Contains at least one special character
 * 
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required.",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one letter.",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number.",
    };
  }

  // Check for at least one special character
  if (!/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character.",
    };
  }

  return {
    isValid: true,
    message: "Password is valid.",
  };
};

export default validatePassword;

