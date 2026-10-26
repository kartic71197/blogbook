export function appError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isAppError = true;
    return error;
}