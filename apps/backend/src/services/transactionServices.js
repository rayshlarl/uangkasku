import prisma from "../config/db.js";
import { ApiError } from "../utils/ApiErrorHandler.js";

export const transactionServices = {
  getAllTransactions: async () => {
    return await prisma.transaction.findMany({
      where: {
        deleted: false,
      },
    });
  },
  createNewTx: async (data) => {
    tableNgawur();
    const { amount, username, note, title, type } = data;
    const isUserExist = await prisma.karyawan.findFirst({
      select: {
        id: true,
      },
      where: {
        name: username,
      },
    });
    if (!isUserExist) throw new ApiError(404, "Tidak ada user yang cocok");
    return await prisma.transaction.create({
      data: {
        amount: parseInt(amount),
        createdBy: parseInt(isUserExist.id),
        note: note,
        title: title,
        type: type,
        date: new Date(),
      },
    });
  },
  editTx: async (param, data) => {
    const { id } = param;
    const { amount, note, title, type } = data;
    const isTxExist = await prisma.transaction.findFirst({
      where: { id: parseInt(id) },
    });
    if (!isTxExist) throw new ApiError(404, "Transaksi tidak ditemukan");
    return await prisma.transaction.update({
      data: {
        amount: parseInt(amount),
        note: note,
        title: title,
        type: type,
      },
      where: {
        id: parseInt(id),
      },
    });
  },
  deleteTx: async (data) => {
    const { id } = data;
    const isTxExist = await prisma.transaction.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!isTxExist) {
      throw new ApiError(400, "Data transaksi tidak dapat ditemukan");
    }
    return await prisma.transaction.update({
      where: {
        id: parseInt(id),
      },
      data: {
        deleted: true,
      },
    });
  },
};
