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
    const { amount, username, note, title, type } = data;
    let transAmount = { totalPemasukan: 0, totalPengeluaran: 0 };
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new ApiError(
        "Nominal transaksi harus berupa angka yang lebih besar dari 0"
      );
    }
    // Check user exist
    const isUserExist = await prisma.karyawan.findFirst({
      select: {
        id: true,
      },
      where: {
        nama: username,
      },
    });
    if (!isUserExist) throw new ApiError(404, "Tidak ada user yang cocok");
    //Validasi input
    if (type === "PENGELUARAN") {
      const aggretiation = await prisma.transaction.groupBy({
        by: ["type"],
        _sum: {
          amount: true,
        },
        where: {
          deleted: false,
        },
      });
      aggretiation.forEach((group) => {
        if (group.type === "PEMASUKAN")
          transAmount.totalPemasukan = group._sum.amount || 0;
        if (group.type === "PENGELUARAN")
          transAmount.totalPengeluaran = group._sum.amount || 0;
      });
      const totalBalance =
        transAmount.totalPemasukan - transAmount.totalPengeluaran;
      if (parsedAmount > totalBalance)
        throw new ApiError(
          409,
          `Saldo tidak mencukupi, saldo saat ini ${totalBalance}`
        );
    }

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
