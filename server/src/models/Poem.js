import mongoose from "mongoose";

const poemSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        // trim only strips the ends, so line breaks and stanza gaps inside are kept
        body: {
            type: String,
            required: [true, "Poem body is required"],
            trim: true,
            maxlength: [5000, "Poem cannot exceed 5000 characters"],
        },
        votes: [{
            _id:false,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required:true
            },
            value:  {
                type: Number,
                required:true,
                enum:[1,-1]
            }
        }]
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
    }
);

poemSchema.index({ createdAt: -1 });
poemSchema.index({ author: 1, createdAt: -1 });

const Poem = mongoose.model("Poem", poemSchema);

export default Poem;
