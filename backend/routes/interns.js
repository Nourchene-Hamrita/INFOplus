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
router.post("/attendance/:internId/:formationId", verifyAdmin, createAttendanceRecord);

//UPDATE
router.put("/attendance/:internId/:formationId", verifyAdmin, updateAttendanceRecord);
//DELETE
router.delete("/attendance/:internId/:formationId", verifyAdmin, deleteAttendanceRecord);
//GET

router.get("/:internId/attendance", getAttendanceRecords);
//GET ALL

router.get("/:internId/attendance/date", getAttendanceRecordForDate);
router.get("/attendance/summary", verifyAdmin, getAllInternsOverallAttendanceSummary);
router.get("/:internId/attendance/summary", getOverallAttendanceSummary);
router.get('/attendance/report', getAttendanceReport);



export default router;