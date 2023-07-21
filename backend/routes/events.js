import express from "express";
import {
    countByLocation,
    countByType,
    createEvent,
    deleteEvent,
    getEvent,
    getEvents,
    getAllEvents,
    updateEvent,
} from "../controllers/event.js";

import { verifyAdmin } from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createEvent);

//UPDATE
router.put("/:id", verifyAdmin, updateEvent);
//DELETE
router.delete("/:id", verifyAdmin, deleteEvent);
//GET

router.get("/find/:id", getEvent);
//GET ALL

router.get("/price", getEvents);
router.get("/", getAllEvents);
router.get("/countByLocation", countByLocation);
router.get("/countByType", countByType);


export default router;