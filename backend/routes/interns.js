import express from "express";
import { getTimeTable } from "../controllers/intern.js";

const router = express.Router();

router.get("/:internId/timetables", getTimeTable)


export default router