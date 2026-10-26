import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
    const cookie = req.cookies;
    if (!cookie.token) {
        return res.status(401)
            .json({ status: "fail", message: "User not logged in !" }
            )
    }
    try {
        const decoded = jwt.verify(cookie.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res
                .status(401)
                .json({ status: "fail", message: "User not found !" }
                );
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401)
            .json({ status: "fail", message: "Invalid or expired token !" }
            );
    }
}