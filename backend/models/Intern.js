import mongoose from "mongoose";

const InternSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Ensure the user is required when creating an intern
        },
        level: { type: String },
        promotion: { type: String },
        formations: [
            {
                formation: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Formation",
                    required: true,
                },
                attendance: [
                    {
                        date: { type: Date, required: true },
                        isPresent: { type: Boolean, default: false },
                        subject: { type: String },
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

export const Intern = mongoose.model("Intern", InternSchema);
