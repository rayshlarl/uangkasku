import express from "express";
import {
  getAllTx,
  createNewTx,
  editTx,
  deleteTx,
  getSumTrans,
  getUserTx,
} from "../controllers/transactionController.js";
import { requireAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllTx);
router.get("/summarize", verifyToken, getSumTrans);
router.get("/profile", verifyToken, getUserTx);
router.post("/createTrans", verifyToken, requireAdmin, createNewTx);
router.put("/:id", editTx);
router.delete("/:id", deleteTx);

export default router;
