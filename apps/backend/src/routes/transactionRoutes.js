import express from "express";
import {
  getAllTx,
  createNewIncomes,
  editTx,
  deleteTx,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getAllTx);
router.post("/createIncome", createNewIncomes);
router.put("/edit/:txId", editTx);
router.delete("/delete/:txId", deleteTx);

export default router;
