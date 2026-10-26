import mongoose from "mongoose";

async function connectDB() {
    try {
        const dbUrl = process.env.MONGO_URI;
        mongoose.set("sanitizeFilter", true);
        await mongoose.connect(dbUrl);
        console.log("Database connected...")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default connectDB;