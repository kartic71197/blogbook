export function notFound(req, res) {
    return res
        .status(404)
        .json({ status: "fail", message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
    if (err.isAppError) {
        return res
            .status(err.statusCode)
            .json({ status: "fail", message: err.message });
    }
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res
            .status(400)
            .json({ status: "fail", message: "Validation failed", errors });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res
            .status(409)
            .json({ status: "fail", message: `${field} already exists` });
    }

    if (err.type === "entity.parse.failed") {
        return res
            .status(400)
            .json({ status: "fail", message: "Invalid JSON" });
    }

    if (err.type === "entity.too.large") {
        return res
            .status(413)
            .json({ status: "fail", message: "Request body too large" });
    }

    if (err.name === "CastError") {
        return res
            .status(400)
            .json({ status: "fail", message: "Invalid ID" });
    }

    console.error(err);
    return res
        .status(500)
        .json({ status: "fail", message: "Something went wrong !" });
}