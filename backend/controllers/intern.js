import { Intern } from '../models/Intern.js';


// Function to create an attendance record for an intern on a specific date
export const createAttendanceRecord = async (req, res) => {
    try {
        const { internId, formationId } = req.params;
        const { date, isPresent, subject } = req.body;
        const intern = await Intern.findOne({ user: internId }).populate('formations.formation');

        if (!intern) {
            return res.status(404).json({ success: false, message: "Intern not found" });
        }

        console.log("intern.formations:", intern.formations);

        // Find the formation with the given formationId in the intern's formations array
        const formation = intern.formations.find((form) => form.formation._id.equals((formationId)));

        console.log("formation:", formation);

        if (!formation) {
            return res.status(404).json({ success: false, message: "Formation not found" });
        }

        // If the formation is a FormationDiplomante, record the subject along with attendance
        if (formation.formation.__t === "FormationDiplomante") {
            // Push the attendance record with the subject field
            formation.attendance.push({
                date: new Date(date),
                isPresent,
                subject,
            });
        } else {
            // For FormationAcceleree, record attendance as before
            formation.attendance.push({
                date: new Date(date),
                isPresent,
            });
        }

        await intern.save();
        return res.status(201).json({ success: true, message: "Attendance record created successfully" });
    } catch (error) {
        console.error('Error creating attendance record:', error.message);
        return res.status(500).json({ success: false, message: "Error creating attendance record" });
    }
};


export const updateAttendanceRecord = async (req, res) => {
    try {
        const { internId, formationId } = req.params;
        const { isPresent } = req.body;
        const date = req.query.date;
        const subject = req.query.subject;

        if (!date) {
            return res.status(400).json({ success: false, message: "Date parameter is missing" });
        }

        const intern = await Intern.findOne({ user: internId });

        if (!intern) {
            return res.status(404).json({ success: false, message: "Intern not found" });
        }

        // Find the formation with the given formationId in the intern's formations array
        const formation = intern.formations.find((form) => form.formation.equals((formationId)));

        if (!formation) {
            return res.status(404).json({ success: false, message: "Formation not found" });
        }

        // Find the attendance record with the given date and subject (if applicable) in the formation's attendance array
        const attendanceRecord = formation.attendance.find(
            (record) => record.date.getTime() === new Date(date).getTime() && record.subject === subject
        );

        if (attendanceRecord) {
            attendanceRecord.isPresent = isPresent;
            await intern.save();
            return res.json({ success: true, message: "Attendance record updated successfully" });
        } else {
            return res.status(404).json({ success: false, message: "Attendance record not found for the given date and subject" });
        }
    } catch (error) {
        console.error('Error updating attendance record:', error.message);
        return res.status(500).json({ success: false, message: "Error updating attendance record" });
    }
};



export const getAttendanceRecords = async (req, res) => {
    try {
        const { internId } = req.params;
        const intern = await Intern.findOne({ user: internId }).populate('formations.formation');

        if (intern) {
            const attendanceRecords = intern.formations.reduce((acc, formation) => {
                acc.push(...formation.attendance.map((record) => ({ ...record.toObject(), formation: formation.formation })));
                return acc;
            }, []);

            return res.json({ success: true, attendance: attendanceRecords });
        } else {
            return res.status(404).json({ success: false, message: "Intern not found" });
        }
    } catch (error) {
        console.error('Error fetching attendance records:', error.message);
        return res.status(500).json({ success: false, message: "Error fetching attendance records" });
    }
};



export const getAttendanceRecordForDate = async (req, res) => {
    try {
        const { internId } = req.params;
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({ success: false, message: "Date parameter is missing" });
        }

        const intern = await Intern.findOne({ user: internId }).populate({
            path: 'formations.formation',
            model: 'Formation'
        });

        if (intern) {
            const attendanceRecord = intern.formations.reduce((acc, formation) => {
                const record = formation.attendance.find((record) => record.date.getTime() === new Date(date).getTime());
                if (record) {
                    acc.push({ formation: formation.formation, attendanceRecord: record });
                }
                return acc;
            }, []);

            if (attendanceRecord.length > 0) {
                return res.json({ success: true, attendanceRecord });
            } else {
                return res.status(404).json({ success: false, message: "Attendance record not found for the given date" });
            }
        } else {
            return res.status(404).json({ success: false, message: "Intern not found" });
        }
    } catch (error) {
        console.error('Error fetching attendance record:', error.message);
        return res.status(500).json({ success: false, message: "Error fetching attendance record" });
    }
};



export const getOverallAttendanceSummary = async (req, res) => {
    try {
        const { internId } = req.params;
        const intern = await Intern.findOne({ user: internId });

        if (intern) {
            let totalDays = 0;
            let daysPresent = 0;
            let daysAbsent = 0;

            intern.formations.forEach((formation) => {
                totalDays += formation.attendance.length;
                daysPresent += formation.attendance.filter((record) => record.isPresent).length;
            });

            daysAbsent = totalDays - daysPresent;
            const attendancePercentage = (daysPresent / totalDays) * 100;

            return res.json({
                success: true,
                totalDays,
                daysPresent,
                daysAbsent,
                attendancePercentage,
            });
        } else {
            return res.status(404).json({ success: false, message: "Intern not found" });
        }
    } catch (error) {
        console.error('Error calculating attendance summary:', error.message);
        return res.status(500).json({ success: false, message: "Error calculating attendance summary" });
    }
};



// Function to calculate the overall attendance summary for all interns
export const getAllInternsOverallAttendanceSummary = async (req, res) => {
    try {
        console.log('Getting overall attendance summary...');
        const summaries = await Intern.aggregate([
            {
                $unwind: "$formations", // Unwind the formations array
            },
            {
                $group: {
                    _id: "$user", // Group by the user (intern) ID
                    totalDays: { $sum: { $size: "$formations.attendance" } }, // Calculate the total days for each intern
                    daysPresent: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: "$formations.attendance",
                                    as: "record",
                                    cond: { $eq: ["$$record.isPresent", true] },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    internId: "$_id",
                    _id: 0,
                    daysAbsent: { $subtract: ["$totalDays", "$daysPresent"] },
                    attendancePercentage: {
                        $multiply: [{ $divide: ["$daysPresent", "$totalDays"] }, 100],
                    },
                },
            },
        ]);

        return res.json({ success: true, summaries });

    } catch (error) {
        console.error('Error calculating overall attendance summary:', error);
        return res.status(500).json({ success: false, message: "Error calculating overall attendance summary" });
    }
};


export const deleteAttendanceRecord = async (req, res) => {
    try {
        const { internId, formationId } = req.params;
        const date = req.query.date;
        const subject = req.query.subject;

        if (!date) {
            return res.status(400).json({ success: false, message: "Date parameter is missing" });
        }

        const intern = await Intern.findOne({ user: internId });

        if (!intern) {
            return res.status(404).json({ success: false, message: "Intern not found" });
        }

        // Find the formation with the given formationId in the intern's formations array
        const formation = intern.formations.find((form) => form.formation.equals(formationId));

        if (!formation) {
            return res.status(404).json({ success: false, message: "Formation not found" });
        }

        // Check if the formation is a FormationDiplomante
        if (formation.formation.__t === "FormationDiplomante") {
            if (!subject) {
                return res.status(400).json({ success: false, message: "Subject parameter is missing" });
            }

            // Use the Mongoose pull() method to remove the attendance record with the specified date and subject from the array
            formation.attendance.pull({ date: new Date(date), subject });

        } else {
            // For FormationAcceleree or other types, use the Mongoose pull() method to remove the attendance record with the specified date from the array
            formation.attendance.pull({ date: new Date(date) });
        }

        // Save the updated intern document to remove the attendance record
        await intern.save();

        return res.json({ success: true, message: "Attendance record deleted successfully" });
    } catch (error) {
        console.error('Error deleting attendance record:', error.message);
        return res.status(500).json({ success: false, message: "Error deleting attendance record" });
    }
};


export const getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Convert the date strings to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure startDate is before endDate
        if (start > end) {
            return res.status(400).json({ error: 'startDate must be before endDate' });
        }

        // Find all attendance records within the specified date range
        const attendanceReport = await Intern.find({
            createdAt: { $gte: start, $lte: end },
        }).select('-_id user createdAt');

        // Send the attendance report as a response
        res.json(attendanceReport);
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




