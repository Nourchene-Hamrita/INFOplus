import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema(
    {
        level: {
            type: String,
            required: [true, "Please provide a level"],
        },
        timetableFile: {
            type: Buffer, // Store the PDF file as a buffer
            required: true,
        },
        timetableFileName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Timetable = mongoose.model("Timetable", TimetableSchema);
