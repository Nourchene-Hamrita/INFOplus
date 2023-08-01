import mongoose from "mongoose";

const InternSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Ensure the user is required when creating an intern
        },
        levels: {  levels: [{ type: String }], },
        promotion: { type: String },
        formations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Formation",
            },
        ],
    },
    { timestamps: true }
);

export const Intern = mongoose.model("Intern", InternSchema);
