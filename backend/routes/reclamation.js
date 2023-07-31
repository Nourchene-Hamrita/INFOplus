import express from "express";
const router = express.Router();
import { getAllReclamations, getReclamationById, createReclamation, updateReclamation, deleteReclamation, getReclamationsByUserId } from "../controllers/reclamation.js"


router.get('/getAllReclamations', getAllReclamations);
router.get('/getReclamationById/:id', getReclamationById);
router.get('/getReclamationsByUserId/:userId', getReclamationsByUserId);
router.post('/createReclamation', createReclamation);
router.put('/updateReclamation/:id', updateReclamation);
router.delete('/deleteReclamation/:id', deleteReclamation);



export default router;