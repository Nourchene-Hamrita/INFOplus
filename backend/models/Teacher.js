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
        levels: [{ type: String }],
        assignedClasses: [
            {
                formationId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Formation", // Reference to Formation's classes

                },
                classId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Formation.classes", // Reference to Formation's classes

                },
                subjects: [{ type: String }], // Subjects taught by the teacher in this class
            },
        ],
    },
    { timestamps: true }
);
export const Teacher = mongoose.model("Teacher", TeacherSchema);