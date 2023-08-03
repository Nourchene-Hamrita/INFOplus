import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByIntern,
  updatePaymentById,
  deletePaymentById
} from "../controllers/paiement.js";
import { protect, verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();



//CREATE
router.post("/create", verifyAdmin, createPayment);

//UPDATE
router.put("/:id", verifyAdmin, updatePaymentById);
//DELETE
router.delete("/:id", verifyAdmin, deletePaymentById);
//GET BY ID

router.get("/find/:id", getPaymentById);
//GET ALL

router.get("/",verifyAdmin, getAllPayments);
router.get('/getPaymentsByIntern/:internId', getPaymentsByIntern);



export default router;
