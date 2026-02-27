import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiErrorHandler.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        401,
        "Akses ditolak! Token tidak ditemukan atau format salah"
      );
    }
    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      throw new ApiError(
        500,
        "Sistem kemanan server (JWT_SECRET) belom dikonfigurasi"
      );
    }
    const decodePayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodePayload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(
        new ApiError(401, "Sesi anda telah berakhir silahkan login kembali")
      );
    } else if (error.name === "JsonWebTOokenError") {
      next(new ApiError(401, "Token tidak valid"));
    } else {
      next(error);
    }
  }
};

export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return next(new ApiError(403, "anda tidak memiliki akses ke bagian ini"));
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
