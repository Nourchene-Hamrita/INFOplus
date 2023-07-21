import express from "express";
import multer from "multer";
const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory as Buffers
const upload = multer({ storage });

// Import the Timetable and Intern models
import { Timetable } from "../models/Timetable.js";
import { Intern } from "../models/Intern.js";

// Route to upload timetable
router.post("/upload", upload.single("timetable"), async (req, res) => {
  try {
    const { internId, level } = req.body;
    const { originalname, buffer } = req.file;

    // Find the intern user by the userId
    const intern = await Intern.findOne({ user: internId });

    if (!intern) {
      return res.status(404).json({ error: "Intern user not found." });
    }

    // Create a new Timetable document and save the uploaded file
    const timetable = new Timetable({
      intern: intern.user, // Save the reference to the intern user
      level,
      timetableFile: buffer,
      timetableFileName: originalname,
    });

    await timetable.save();

    res.status(201).json({ message: "Timetable uploaded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload timetable." });
  }
});

export default router;
