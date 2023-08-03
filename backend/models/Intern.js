import mongoose from "mongoose";

const InternSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Ensure the user is required when creating an intern
        },
        level: { type: String } ,
        promotion: { type: String },
        formations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Formation",
            },
        ],
        attendance: [
            {
              date: { type: Date, required: true }, // Date of the attendance session
              isPresent: { type: Boolean, default: false }, // Whether the intern is present or not
            },
          ],
    },
    { timestamps: true }
);

export const Intern = mongoose.model("Intern", InternSchema);
