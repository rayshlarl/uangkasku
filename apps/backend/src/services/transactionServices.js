import { Query } from "pg";
import prisma from "../config/db.js";
import { ApiError } from "../utils/ApiErrorHandler.js";

export const transactionServices = {
  getAllTransactions: async (query) => {
    const page = parseInt(query.page) || 1;
    if (page < 0) throw new ApiError(404, "Data not found");
    const limit = parseInt(query.limit) || 10;

    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (page - 1) * safeLimit;

    const [transactions, totalData] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: {
          deleted: false,
        },
        include: {
          karyawan: {
            omit: {
              password: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: skip,
        take: safeLimit,
      }),
      prisma.transaction.count({
        where: {
          deleted: false,
        },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        totalData: totalData,
        totalPages: Math.ceil(totalData / safeLimit),
        currentPage: page,
        perPage: safeLimit,
      },
    };
  },
  summarizeTrans: async () => {
    const [aggretiation, totalTrans] = await prisma.$transaction([
      prisma.transaction.groupBy({
        by: ["type"],
        _sum: {
          amount: true,
        },
        where: {
          deleted: false,
        },
      }),
      prisma.transaction.count({
        where: {
          deleted: false,
        },
      }),
    ]);

    let incomes = 0;
    let expenses = 0;

    aggretiation.forEach((group) => {
      if (group.type === "PEMASUKAN") {
        incomes = group._sum.amount;
      } else if (group.type === "PENGELUARAN") {
        expenses = group._sum.amount;
      } else {
        throw new ApiError(403, "Gagal memuat data, coba lagi nanti ");
      }
    });
    return {
      totalInc: incomes,
      totalExp: expenses,
      balance: incomes - expenses,
      totalTrans: totalTrans,
    };
  },
  getUserTx: async (query, userData) => {
    const userId = parseInt(userData.id);
    if (isNaN(userId)) throw new ApiError(400, "Data tidak valid");

    const page = parseInt(query.page) || 1;
    if (page < 0) throw new ApiError(404, "Data tidak ditemukan");

    const limit = parseInt(query.limit) || 10;
    const safelimit = Math.min(Math.max(limit, 1), 100);
    const skip = (page - 1) * safelimit;

    const [transactions, totalData, aggretiation] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: {
          deleted: false,
          createdBy: userId,
        },
        include: {
          karyawan: {
            omit: {
              password: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: skip,
        take: safelimit,
      }),
      prisma.transaction.count({
        where: {
          deleted: false,
          createdBy: userId,
        },
      }),
      prisma.transaction.groupBy({
        by: ["type"],
        _sum: {
          amount: true,
        },
        where: {
          createdBy: userId,
          deleted: false,
        },
      }),
    ]);

    let incomes = 0;
    let expenses = 0;
    aggretiation.forEach((group) => {
      if (group.type === "PEMASUKAN") {
        incomes = group._sum.amount || 0;
      } else if (group.type === "PENGELUARAN") {
        expenses = group._sum.amount || 0;
      } else {
        throw new ApiError(403, "Gagal memuat data, silahkan coba lagi");
      }
    });

    return {
      stats: {
        totalInc: incomes,
        totalExp: expenses,
        balance: incomes - expenses,
      },
      data: transactions,
      meta: {
        totalData: totalData,
        totalPages: Math.ceil(totalData / safelimit),
        currentPage: page,
        perPage: safelimit,
      },
    };
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
