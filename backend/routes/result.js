import express from "express";

import { addResult, getResultByFormation, getResultInternFormation, searchResults, updateResult } from "../controllers/result.js";
import { protect, verifyAdmin } from "../utils/verifyToken.js";



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
    verifyAdmin,
    updateResult
);
router.get(
    "/getResultByFormation/:formationId", getResultByFormation
);
router.get(
    "/getResultIntern/:internId/:formationId/", getResultInternFormation
);
router.get('/search',searchResults);

export default router;