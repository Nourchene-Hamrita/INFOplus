import express from "express";
const router = express.Router();
import multer from 'multer';
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({ storage });

import {
  getAllFormations,
  getFormationById,
  createFormation,
  UpdateFormation,
  deleteFormation,
  createFormationReview,
  createAssignment,
  createAnnouncement,
  getClassAssignments,
  getClassAnnouncements,
  getStudentLevelContent,
  createClass,
  updateClass,
  getAssignmentById,
  getInternsAttendanceSummary,
  getClassesByTeacher,
  getClassById,
  deleteAssignment,
  deleteAnnouncement,
  getClassInterns
} from "../controllers/formation.js"
import { protect, verifyToken } from "../utils/verifyToken.js";



// Routes pour les formations
router.get("/getAll", getAllFormations);
router.get("/:id", getFormationById);
router.post("/new", createFormation);
router.put("/update/:id", UpdateFormation);
router.delete("/delete/:id", deleteFormation);
router.post("/:id/reviews", protect, createFormationReview);

// New routes for assignments and announcements
router.post('/:formationId/classes', protect, createClass);
router.post(
  '/:formationId/classes/:className/assignments',
  upload.single('attachment'), protect,
  createAssignment
);
router.put(
  '/:formationId/classes/:className',
  updateClass
);
router.post("/:formationId/classes/:className/announcements", protect, createAnnouncement);

router.get("/classes/:formationId/:classId", verifyToken, getClassById);

router.get("/:teacherId/classes", verifyToken, getClassesByTeacher);
router.get("/:formationId/classes/:className/assignments", getClassAssignments);
router.get("/:formationId/classes/:className/:assignmentId", getAssignmentById);
router.get("/:formationId/class/:className/announcements", getClassAnnouncements);
router.get("/:formationId/class/:className/interns", getClassInterns);



router.get("/:internId/level-content", verifyToken, getStudentLevelContent);
router.get('/:formationId/:classId/attendance-summary', verifyToken, getInternsAttendanceSummary);

router.delete('/:formationId/classes/:className/assignments/:assignmentId',verifyToken, deleteAssignment);
router.delete('/:formationId/classes/:className/announcements/:announcementId',verifyToken, deleteAnnouncement);



export default router;


