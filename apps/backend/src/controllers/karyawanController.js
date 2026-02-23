import { karyawanService } from "../services/karyawanServices.js";

export const getAllKaryawan = async (req, res, next) => {
  try {
    const response = await karyawanService.getAllKaryawan();
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const createKaryawan = async (req, res, next) => {
  try {
    const response = await karyawanService.createKaryawan(req.body);
    res
      .status(201)
      .json({ message: "Karyawan baru ditambahkan", data: response });
  } catch (err) {
    next(err);
  }
};
