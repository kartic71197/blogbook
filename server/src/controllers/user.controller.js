import User from "../models/User.js";
import { appError } from "../utils/AppError.js";

export function getMe(req, res) {
    return res.status(200).json({
        status: "ok",
        data: { user: req.user },
    });
}

export async function updateMe(req, res) {
    const { firstName, lastName } = req.body;

    if (firstName === undefined && lastName === undefined) {
        throw appError("Nothing to update !", 400);
    }

    if (firstName !== undefined) req.user.firstName = firstName;
    if (lastName !== undefined) req.user.lastName = lastName;

    await req.user.save()

    return res.status(200).json({
        status: "ok",
        message: "User updated successfully !",
        data: { user: req.user }
    });
}

export async function changePassword(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!newPassword)
        throw appError("New Password is required !", 400);

    if (newPassword !== confirmPassword)
        throw appError("Password doesnt match !", 400);

    if (!currentPassword)
        throw appError("Current password is required !", 400);

    const user = await User.findById(req.user._id).select("+password");
    const comparePassword = await user.comparePassword(currentPassword);
    if (!comparePassword)
        throw appError("Current password is incorrect !", 400);

    user.password = newPassword;
    await user.save()
    return res.status(200).json({ status: "ok", message: "Password updated successfully !" })
}