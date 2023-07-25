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
// Route to get the PDF file data by timetable ID
router.get("/:timetableId/pdf", async (req, res) => {
  try {
    const { timetableId } = req.params;

    // Find the timetable by ID
    const timetable = await Timetable.findById(timetableId);

    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    // Set the appropriate response headers to indicate the content type
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${timetable.timetableFileName}"`
    );

    // Send the PDF data as the response
    res.send(timetable.timetableFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch timetable PDF" });
  }
});


export default router;
