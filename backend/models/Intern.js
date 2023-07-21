import mongoose from "mongoose";

const InternSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        level: { type: String, required: [true, "Please provide a level"] },

        promotion: { type: String },
    },
    { timestamps: true }
);
export const Intern = mongoose.model("Intern", InternSchema);
