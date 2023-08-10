import mongoose from "mongoose";


const ResultSchema = new mongoose.Schema(
    {
        scores: [
            {
                subject: { type: String, required: true },
                note_cc: { type: Number, default: null },
                note_tp: { type: Number, default: null },
                note_examen: { type: Number, default: null },
            },
        ],

        intern: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation" },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export const Result = mongoose.model("Result", ResultSchema);
