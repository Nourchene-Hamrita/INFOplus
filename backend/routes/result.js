import express from "express";

import { addResult, deleteResult, getResultByFormation, getResultInternFormation, getResultsByTeacher, getStudentReport, searchResult, searchResults, searchSubjectResults, updateResult } from "../controllers/result.js";
import { protect, verifyAdmin, verifyToken } from "../utils/verifyToken.js";



const router = express.Router();

// Route to add a new result
router.post(
    "/add",
    protect,
    addResult
);
router.put(
    "/update/:id",
    protect,
    updateResult
);
router.delete(
    "/delete/:id",
    verifyToken,
    deleteResult
);
router.get(
    "/getResultByFormation/:formationId", getResultByFormation
);
router.get(
    "/getResultIntern/:internId/:formationId", getResultInternFormation
);
router.get('/search', searchResults);
router.get('/subject/search', searchSubjectResults);
router.get('/formationORsubject/search', searchResult);
router.get('/getResultReport/:internId/:formationId', getStudentReport);
router.get('/teacher/:teacherId', getResultsByTeacher);

export default router;