import prisma from "../config/db.js";
import { transactionServices } from "../services/transactionServices.js";

//Get all transaction
export const getAllTx = async (req, res, next) => {
  try {
    const response = await transactionServices.getAllTransactions();
    res.status(200).json({ valid: true, data: response });
  } catch (err) {
    next(err);
  }
};

// Create incomes - Pemasukan uang kas
export const createNewTx = async (req, res, next) => {
  try {
    const response = await transactionServices.createNewTx(req.body);
    res
      .status(200)
      .json({ valid: true, message: "Pencatatan berhasil", data: response });
  } catch (err) {
    next(err);
  }
};

// Edit transaction
export const editTx = async (req, res, next) => {
  try {
    const response = await transactionServices.editTx(req.params, req.body);
    res
      .status(200)
      .json({ valid: true, message: "Berhasil di update", data: response });
  } catch (err) {
    next(err);
  }
};

// Delete transaction
export const deleteTx = async (req, res, next) => {
  try {
    await transactionServices.deleteTx(req.params);
    res
      .status(200)
      .json({ valid: true, message: "Transaksi berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};
