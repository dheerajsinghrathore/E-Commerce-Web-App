
const validateEmail = (email) => {
    if (!email) {
        return {
            isValid: false,
            message: "Email is required.",
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: "Please provide a valid email address.",
        };
    }

    return {
        isValid: true,
        message: "Email is valid.",
    };
};

export default validateEmail;
