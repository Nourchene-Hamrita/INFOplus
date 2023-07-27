import express from "express";
const router = express.Router();
import {
  getAllFormations,
  getFormationById,
  createFormation,
  UpdateFormation,
  deleteFormation,
  createFormationReview,
}from "../controllers/formation.js"
import {protect } from "../utils/verifyToken.js";

// Routes pour les formations
router.get("/getAll", getAllFormations);
router.get("/:id", getFormationById);
router.post("/new", createFormation);
router.put("/update/:id", UpdateFormation);
router.delete("/delete/:id", deleteFormation);
router.post("/:id/reviews",protect,createFormationReview);

export default router;