import { Role } from "@prisma/client";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiErrorHandler.js";

export const karyawanService = {
  getAllKaryawan: async () => {
    return await prisma.karyawan.findMany({
      omit: {
        password: true,
      },
      where: {
        role: "KARYAWAN",
        deleted: false,
      },
    });
  },

  createKaryawan: async (data) => {
    const { nama, email, password } = data;
    const isUSerExist = await prisma.karyawan.findFirst({
      where: {
        email: email,
      },
    });
    const hashPassword = await bcrypt.hash(password, 10);
    if (isUSerExist && !isUSerExist.deleted) {
      throw new ApiError(209, "Email sudah digunakan");
    } else if (isUSerExist && isUSerExist.deleted) {
      return await prisma.karyawan.update({
        data: {
          ...data,
          password: hashPassword,
          role: "KARYAWAN",
          deleted: false,
        },
        where: {
          id: parseInt(isUSerExist.id),
        },
      });
    }
    return await prisma.karyawan.create({
      data: { ...data, password: hashPassword, role: "KARYAWAN" },
    });
  },
};
