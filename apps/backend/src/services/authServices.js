import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiErrorHandler.js";

export const authServices = {
  login: async (data) => {
    const { email, password } = data;
    const karyawan = await prisma.karyawan.findFirst({
      where: {
        email: email,
      },
    });
    if (!karyawan) throw new ApiError(401, "Akun tidak ditemukan");
    const isMatch = await bcrypt.compare(password, karyawan.password);
    if (!isMatch) throw new ApiError(401, "Email atau password salah");

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "Konfigurasi server (JWT_SECRET) tidak valid");
    }

    const token = jwt.sign(
      {
        id: karyawan.id,
        email: karyawan.email,
        role: karyawan.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return {
      user: { nama: karyawan.nama, email: karyawan.email, role: karyawan.role },
      token: token,
    };
  },
};
