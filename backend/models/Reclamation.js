import mongoose from "mongoose";

const ReclamationSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        date: { type: Date, default: Date.now },
        intern: { type: mongoose.Schema.Types.ObjectId, ref: "Intern" },
        subject: { type: String, required: true },
        state: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
        response: { type: String, default: '' },

    },
    { timestamps: true }
);

export const Reclamation = mongoose.model("Reclamation", ReclamationSchema);
