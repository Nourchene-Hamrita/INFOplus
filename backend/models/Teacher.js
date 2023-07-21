import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        salary: { type: String },
        specialty: {
            type: String,
            default: "vacataire",
            enum: ["vacataire", "permanent"],
        },
        profil: {
            type: String,
            enum: ["anglais", "francais", "info"],
        },
    },
    { timestamps: true }
);
export const Teacher = mongoose.model("Teacher", TeacherSchema);