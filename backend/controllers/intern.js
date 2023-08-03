import { Intern } from '../models/Intern.js';

// Function to create an attendance record for an intern on a specific date
export const createAttendanceRecord = async (internId, date, isPresent) => {
    try {
        const intern = await Intern.findById(internId);
        if (intern) {
            intern.attendance.push({ date, isPresent });
            await intern.save();
            return { success: true, message: "Attendance record created successfully" };
        } else {
            return { success: false, message: "Intern not found" };
        }
    } catch (error) {
        return { success: false, message: "Error creating attendance record" };
    }
};

// Function to update the attendance record for an intern on a specific date
export const updateAttendanceRecord = async (internId, date, isPresent) => {
    try {
        const intern = await Intern.findById(internId);
        if (intern) {
            const attendanceRecord = intern.attendance.find((record) => record.date.toISOString() === date.toISOString());
            if (attendanceRecord) {
                attendanceRecord.isPresent = isPresent;
                await intern.save();
                return { success: true, message: "Attendance record updated successfully" };
            } else {
                return { success: false, message: "Attendance record not found for the given date" };
            }
        } else {
            return { success: false, message: "Intern not found" };
        }
    } catch (error) {
        return { success: false, message: "Error updating attendance record" };
    }
};

// Function to get all attendance records for a specific intern
export const getAttendanceRecords = async (internId) => {
    try {
        const intern = await Intern.findById(internId);
        if (intern) {
            return { success: true, attendance: intern.attendance };
        } else {
            return { success: false, message: "Intern not found" };
        }
    } catch (error) {
        return { success: false, message: "Error fetching attendance records" };
    }
};

// Function to get the attendance record for a specific intern on a given date
export const getAttendanceRecordForDate = async (internId, date) => {
    try {
        const intern = await Intern.findById(internId);
        if (intern) {
            const attendanceRecord = intern.attendance.find((record) => record.date.toISOString() === date.toISOString());
            if (attendanceRecord) {
                return { success: true, attendanceRecord };
            } else {
                return { success: false, message: "Attendance record not found for the given date" };
            }
        } else {
            return { success: false, message: "Intern not found" };
        }
    } catch (error) {
        return { success: false, message: "Error fetching attendance record" };
    }
};

// Function to calculate the overall attendance summary for a specific intern
export const getOverallAttendanceSummary = async (internId) => {
    try {
        const intern = await Intern.findById(internId);
        if (intern) {
            const totalDays = intern.attendance.length;
            const daysPresent = intern.attendance.filter((record) => record.isPresent).length;
            const daysAbsent = totalDays - daysPresent;
            const attendancePercentage = (daysPresent / totalDays) * 100;
            return {
                success: true,
                totalDays,
                daysPresent,
                daysAbsent,
                attendancePercentage,
            };
        } else {
            return { success: false, message: "Intern not found" };
        }
    } catch (error) {
        return { success: false, message: "Error calculating attendance summary" };
    }
};

// Function to calculate the overall attendance summary for all interns
export const getAllInternsOverallAttendanceSummary = async () => {
    try {
        const interns = await Intern.find();
        const summary = interns.map((intern) => {
            const totalDays = intern.attendance.length;
            const daysPresent = intern.attendance.filter((record) => record.isPresent).length;
            const daysAbsent = totalDays - daysPresent;
            const attendancePercentage = (daysPresent / totalDays) * 100;
            return {
                internId: intern._id,
                totalDays,
                daysPresent,
                daysAbsent,
                attendancePercentage,
            };
        });
        return { success: true, summary };
    } catch (error) {
        return { success: false, message: "Error calculating overall attendance summary" };
    }
};

// Function to delete an attendance record for a specific intern on a given date
export const deleteAttendanceRecord = async (internId, date) => {
    try {
        const intern = await Intern.findById(internId);
        if (intern) {
            intern.attendance = intern.attendance.filter((record) => record.date.toISOString() !== date.toISOString());
            await intern.save();
            return { success: true, message: "Attendance record deleted successfully" };
        } else {
            return { success: false, message: "Intern not found" };
        }
    } catch (error) {
        return { success: false, message: "Error deleting attendance record" };
    }
};
export const getAttendanceReport = async (req, res) => {
    try {
      // Extract startDate and endDate from query parameters
      const { startDate, endDate } = req.query;
  
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
  


