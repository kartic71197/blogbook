import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import { appError } from "../utils/AppError.js";


export async function register(req, res) {
    const { firstName, lastName, password, email: rawEmail } = req.body;

    if (rawEmail !== undefined && typeof rawEmail !== "string") {
        throw appError("Email must be a string", 400);
    }

    const email = rawEmail?.toLowerCase().trim();

    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    })

    return res.status(201).json({
        status: "ok",
        message: "User created successfully !",
        data: { user }
    });
}

export async function login(req, res) {
    const { email: rawEmail, password } = req.body;
    if (typeof rawEmail !== "string" || typeof password !== "string") {
        throw appError("Email and password are required", 400);
    }

    const email = rawEmail.toLowerCase().trim();

    if (!email || !password) {
        throw appError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        throw appError("Invalid email or password", 401);
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res
        .status(200)
        .json({ status: "ok", message: "Logged in successfully", data: { user } });
}
export function logout(req, res) {
    res.clearCookie("token", cookieOptions);
    return res
        .status(200)
        .json({ status: "ok", message: "Logged out successfully" });
}
