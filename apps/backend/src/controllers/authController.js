import prisma from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Login
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const karyawan = await prisma.karyawan.findFirst({
      where: {
        email: email,
      },
    });

    // Cek email ada?
    if (!karyawan) {
      return res
        .status(401)
        .json({ valid: false, error: "Akun tidak ditemukan" });
    }
    // Cek hashed password
    const isMatch = await bcrypt.compare(password, karyawan.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ valid: false, error: "Email atau password salah" });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: karyawan.id, email: karyawan.email, role: karyawan.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      valid: true,
      data: { nama: karyawan.nama, email: karyawan.email, role: karyawan.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ valid: false, error: "Login gagal" });
  }
};
