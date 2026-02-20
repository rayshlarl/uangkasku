import prisma from "../config/db.js";

//Get all transaction
export const getAllTx = async (req, res) => {
  try {
    const response = await prisma.transaction.findMany();
    res.status(200).json({ valid: true, data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal memuat transaksi" });
  }
};

// Create incomes - Pemasukan uang kas
export const createNewIncomes = async (req, res) => {
  const { amount, userId, note, title } = req.body;
  try {
    // Cek user id ada?
    const checkUser = await prisma.karyawan.findFirst({
      select: {
        id: true,
      },
      where: {
        id: parseInt(userId),
      },
    });
    if (!checkUser) {
      return res
        .status(401)
        .json({ valid: false, error: "Akun tidak ditemukan" });
    }
    const response = await prisma.transaction.create({
      data: {
        amount: parseInt(amount),
        createdBy: parseInt(userId),
        note: note,
        title: title,
        type: "PEMASUKAN",
        date: new Date(),
      },
    });
    res
      .status(200)
      .json({ valid: true, message: "Pencatatan berhasil", data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ valid: false, error: "gagal mencatat pemasukan" });
  }
};

// Edit transaction
export const editTx = async (req, res) => {
  const { txId } = req.params;
  const { amount, note, title, type } = req.body;
  try {
    const response = await prisma.transaction.update({
      data: {
        amount: parseInt(amount),
        note: note,
        title: title,
        type: type,
      },
      where: {
        id: parseInt(txId),
      },
    });
    res
      .status(200)
      .json({ valid: true, message: "Berhasil di update", data: response });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ valid: false, error: "Gagal memuat data transaksi" });
  }
};

// Delete transaction
export const deleteTx = async (req, res) => {
  const { txId } = req.params;
  try {
    const response = await prisma.transaction.delete({
      where: {
        id: parseInt(txId),
      },
    });
    res.status(200).json({ valid: false, error: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ valid: false, error: "Transaksi tidak dapat dihapus" });
  }
};
