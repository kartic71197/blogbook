import jwt from "jsonwebtoken";


export function generateToken(id) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}