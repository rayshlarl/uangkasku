import express from "express";
import {
  getAllTx,
  getTotalExpenses,
  getTotalIncomes,
  createNewIncomes,
  editTx,
  deleteTx,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getAllTx);
router.get("/expenses", getTotalExpenses);
router.get("/incomes", getTotalIncomes);
router.post("/createIncome", createNewIncomes);
router.put("/edit/:txId", editTx);
router.delete("/delete/:txId", deleteTx);

export default router;
