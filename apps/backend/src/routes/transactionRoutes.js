import express from "express";
import {
  getAllTx,
  createNewTx,
  editTx,
  deleteTx,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getAllTx);
router.post("/", createNewTx);
router.put("/:id", editTx);
router.delete("/:id", deleteTx);

export default router;
