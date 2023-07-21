import { Intern } from "../models/Intern.js";
import { Timetable } from "../models/Timetable.js";

export const getTimeTable = async (req, res, next) => {
    const { internId } = req.params;

  try {
    // Find the intern by user ID
    const intern = await Intern.findOne({ user: internId });

    if (!intern) {
      return res.status(404).json({ error: "Intern not found" });
    }

    // Fetch timetables for the intern's level
    const timetables = await Timetable.find({ level: intern.level });

    res.status(200).json({ timetables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch timetables" });
  }
};


