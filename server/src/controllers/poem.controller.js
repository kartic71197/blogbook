import mongoose from "mongoose";
import Poem from "../models/Poem.js";
import User from "../models/User.js";
import { appError } from "../utils/AppError.js";
import { getPagination, paginationMeta } from "../utils/pagination.js";

const AUTHOR_FIELDS = "firstName lastName";

async function listPoems(filter, query) {
    const { page, limit, skip } = getPagination(query);
    const [poems, total] = await Promise.all([
        Poem.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", AUTHOR_FIELDS),
        Poem.countDocuments(filter),
    ]);
    return { poems, pagination: paginationMeta(page, limit, total) };
}

async function findOwnPoem(poemId, user) {
    const poem = await Poem.findById(poemId);
    if (!poem) throw appError("Poem not found !", 404);
    if (!poem.author.equals(user._id))
        throw appError("You can only change your own poems !", 403);
    return poem;
}

export async function createPoem(req, res) {
    const { title, body } = req.body;

    const poem = await Poem.create({ author: req.user._id, title, body });
    await poem.populate("author", AUTHOR_FIELDS);

    return res.status(201).json({
        status: "ok",
        message: "Poem published successfully !",
        data: { poem },
    });
}

export async function getPoems(req, res) {
    const data = await listPoems({}, req.query);
    return res.status(200).json({ status: "ok", data });
}

export async function getUserPoems(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) throw appError("Invalid ID", 400);
    if (!(await User.exists({ _id: id }))) throw appError("User not found !", 404);

    const data = await listPoems({ author: id }, req.query);
    return res.status(200).json({ status: "ok", data });
}

export async function getPoem(req, res) {
    const poem = await Poem.findById(req.params.id).populate("author", AUTHOR_FIELDS);
    if (!poem) throw appError("Poem not found !", 404);

    return res.status(200).json({ status: "ok", data: { poem } });
}

export async function updatePoem(req, res) {
    const { title, body } = req.body;

    if (title === undefined && body === undefined) {
        throw appError("Nothing to update !", 400);
    }

    const poem = await findOwnPoem(req.params.id, req.user);
    if (title !== undefined) poem.title = title;
    if (body !== undefined) poem.body = body;

    await poem.save();
    await poem.populate("author", AUTHOR_FIELDS);

    return res.status(200).json({
        status: "ok",
        message: "Poem updated successfully !",
        data: { poem },
    });
}

export async function deletePoem(req, res) {
    const poem = await findOwnPoem(req.params.id, req.user);
    await poem.deleteOne();

    return res.status(200).json({ status: "ok", message: "Poem deleted successfully !" });
}

export async function updateVote(req, res) {
    const { value } = req.body;

    if (![1, -1, 0].includes(value))
        throw appError("Vote must be 1, -1 or 0 !", 400);

    const poem = await Poem.findById(req.params.id);
    if (!poem) throw appError("Poem not found !", 404);

    const existing = poem.votes.find((vote) => vote.user.equals(req.user._id));

    if (value === 0) {
        poem.votes = poem.votes.filter((vote) => !vote.user.equals(req.user._id));
    } else if (existing) {
        existing.value = value;
    } else {
        poem.votes.push({ user: req.user._id, value });
    }

    await poem.save();

    const score = poem.votes.reduce((sum, vote) => sum + vote.value, 0);

    return res.status(200).json({
        status: "ok",
        message: "Vote updated !",
        data: { score, myVote: value },
    });
}

