import rateLimit from "express-rate-limit";

// Brute-force protection for login/register: 10 requests per IP per 15 minutes.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { status: "fail", message: "Too many attempts, please try again later" },
});
