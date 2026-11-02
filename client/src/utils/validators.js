// Mirrors server/src/models/User.js. Keep them in sync.
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const NAME_MAX = 25;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;

const validateName = (value, label) => {
    const trimmed = value.trim();
    if (!trimmed) return `${label} is required`;
    if (trimmed.length > NAME_MAX) return `${label} must be at most ${NAME_MAX} characters`;
    return "";
};

const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required";
    if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email";
    return "";
};

const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters`;
    if (value.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters`;
    return "";
};

// Returns only the fields that failed: { email: "Enter a valid email" }. Empty object = valid.
export function validateRegister({ firstName, lastName, email, password, confirmPassword }) {
    const errors = {
        firstName: validateName(firstName, "First name"),
        lastName: validateName(lastName, "Last name"),
        email: validateEmail(email),
        password: validatePassword(password),
        confirmPassword: confirmPassword === password ? "" : "Passwords do not match",
    };

    return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}
