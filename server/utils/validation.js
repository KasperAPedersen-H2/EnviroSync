/**
 * Validates username against predefined rules
 * @param {string} username - The username to validate
 * @returns {string} Error message if validation fails, empty string if valid
 */
export const validateUsername = (username) => {
    const criteria = [
        { test: (name) => !name, message: "Username is required." },
        { test: (name) => name.length < 3 || name.length > 20, message: "Username must be between 3 and 20 characters." },
        { test: (name) => name.match(/[^a-zA-Z0-9]/), message: "Username must not contain special characters." }
    ];

    return validate(username, criteria);
};

/**
 * Validates email against predefined rules
 * @param {string} email - The email to validate
 * @returns {string} Error message if validation fails, empty string if valid
 */
export const validateEmail = (email) => {
    const criteria = [
        { test: (email) => !email, message: "Email is required." },
        { test: (email) => !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), message: "Invalid email address." }
    ];

    return validate(email, criteria);
};

/**
 * Validates password against predefined rules
 * @param {string} password - The password to validate
 * @returns {string} Error message if validation fails, empty string if valid
 */
export const validatePassword = (password) => {
    const criteria = [
        { test: (pass) => pass.length < 8, message: "Password must be at least 8 characters long." },
        { test: (pass) => !/[0-9]/.test(pass), message: "Password must contain at least one number." },
        { test: (pass) => !/[A-Z]/.test(pass), message: "Password must contain at least one uppercase letter." },
        { test: (pass) => !/[a-z]/.test(pass), message: "Password must contain at least one lowercase letter." },
    ];

    return validate(password, criteria);
};

/**
 * Validates that passwords match
 * @param {string} password - The first password
 * @param {string} confirmPassword - The confirmation password
 * @returns {string} Error message if validation fails, empty string if valid
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    const criteria = [
        { test: (pass, confirm) => pass !== confirm, message: "Passwords do not match." }
    ];

    return validateMultiple([password, confirmPassword], criteria);
};

/**
 * Validates user registration data
 * @param {Object} userData - The user data to validate
 * @param {string} userData.username - The username
 * @param {string} userData.email - The email address
 * @param {string} userData.password - The password
 * @param {string} userData.passwordConfirm - The password confirmation
 * @returns {string} Error message if validation fails, empty string if valid
 */
export const validateRegistration = (userData) => {
    const { username, email, password, passwordConfirm } = userData;

    const validationChecks = [
        { validate: () => validateUsername(username) },
        { validate: () => validateEmail(email) },
        { validate: () => validatePassword(password) },
        { validate: () => validatePasswordMatch(password, passwordConfirm) }
    ];

    return validateChecks(validationChecks);
};

/**
 * Validates password change data
 * @param {Object} passwordData - The password change data to validate
 * @param {string} passwordData.newPassword - The new password
 * @param {string} passwordData.confirmPassword - The password confirmation
 * @returns {string} Error message if validation fails, empty string if valid
 */
export const validatePasswordChange = (passwordData) => {
    const { newPassword, confirmPassword } = passwordData;

    const validationChecks = [
        { validate: () => validatePassword(newPassword) },
        { validate: () => validatePasswordMatch(newPassword, confirmPassword) }
    ];

    return validateChecks(validationChecks);
};

/**
 * Generic validation function
 * @param {any} value - The value to validate
 * @param {Array} criteria - Array of criteria objects with test and message properties
 * @returns {string} Error message if validation fails, empty string if valid
 */
function validate(value, criteria) {
    for (let criterion of criteria) {
        if (criterion.test(value)) {
            return criterion.message;
        }
    }

    return "";
}

/**
 * Generic validation function for validation functions
 * @param {Array} validationChecks - Array of objects with validate functions
 * @returns {string} Error message if validation fails, empty string if valid
 */
function validateChecks(validationChecks) {
    for (let check of validationChecks) {
        const errorMessage = check.validate();
        if (errorMessage) {
            return errorMessage;
        }
    }

    return "";
}

function validateMultiple(values, criteria) {
    for (let criterion of criteria) {
        if (criterion.test(...values)) {
            return criterion.message;
        }
    }

    return "";
}
