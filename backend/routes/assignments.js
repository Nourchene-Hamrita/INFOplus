import express from 'express';
import { Formation } from '../models/Formation.js';

const router = express.Router();

router.get("/:formationId/classes/:className/assignments/:assignmentId/attachment", async (req, res) => {
    const { formationId, className, assignmentId } = req.params;

    try {
        const formation = await Formation.findById(formationId);

        if (!formation) {
            return res.status(404).json({ message: "Formation not found" });
        }

        const classInfo = formation.classes.find(cls => cls.name === className);

        if (!classInfo) {
            return res.status(404).json({ message: "Class not found in formation" });
        }

        const assignment = classInfo.assignments.find(assignment => assignment._id.toString() === assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found in class" });
        }

        if (!assignment.attachment) {
            return res.status(404).json({ message: "Attachment not found for this assignment" });
        }

        res.setHeader("Content-Type", assignment.attachmentMimeType);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${assignment.attachmentOriginalName}"`
        );

        res.send(assignment.attachment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch assignment attachment" });
    }
});

export default router;
