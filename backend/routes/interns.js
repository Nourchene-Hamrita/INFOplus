import express from "express";
import {
    createAttendanceRecord,
    deleteAttendanceRecord,
    getAllInternsOverallAttendanceSummary,
    getAttendanceRecordForDate,
    getAttendanceRecords,
    getAttendanceReport,
    getOverallAttendanceSummary,
    updateAttendanceRecord
} from "../controllers/intern.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";


const router = express.Router();

//CREATE
router.post("/:internId/attendance", verifyAdmin, createAttendanceRecord);

//UPDATE
router.put("/:internId/attendance/:date", verifyAdmin, updateAttendanceRecord);
//DELETE
router.delete("/:internId/attendance/:date", verifyAdmin, deleteAttendanceRecord);
//GET

router.get("/:internId/attendance", getAttendanceRecords);
//GET ALL

router.get("/:internId/attendance/:date", getAttendanceRecordForDate);
router.get("/attendance/summary", verifyAdmin, getAllInternsOverallAttendanceSummary);
router.get("/:internId/attendance/summary", getOverallAttendanceSummary);
router.get('/attendance/report', getAttendanceReport);



export default router;