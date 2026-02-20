import prisma from "../config/db.js";
import bcrypt from "bcrypt";

// Ambil semua data karyawan omit pass
export const getAllKaryawan = async (req, res) => {
  try {
    const karyawan = await prisma.karyawan.findMany({
      omit: {
        password: true,
      },
      where: {
        role: "KARYAWAN",
      },
    });
    res.json(karyawan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data karyawan" });
  }
};

// Buat data karyawans
export const createKaryawan = async (req, res) => {
  const { nama, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    // User ada di DB?
    const checkUser = await prisma.karyawan.findFirst({
      where: {
        email: email,
      },
    });
    if (checkUser) {
      return res
        .status(401)
        .json({ valid: false, error: "Email sudah digunakan!" });
    }

    const createUser = await prisma.karyawan.create({
      data: {
        nama: nama,
        email: email,
        password: hashPassword,
        role: "KARYAWAN",
      },
    });
    res
      .status(201)
      .json({ message: "Karyawan baru ditambahkan", data: createUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal bikin user baru" });
  }
};
