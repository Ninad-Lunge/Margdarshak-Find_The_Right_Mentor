const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateEmail = (email) => {
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return passwordRegex.test(password);
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return phoneRegex.test(phone);
};

const validateURL = (url) => {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhoneNumber,
    validateURL
};