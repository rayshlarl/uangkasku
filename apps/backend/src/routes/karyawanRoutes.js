import express from "express";
import {
  getAllKaryawan,
  createKaryawan,
} from "../controllers/karyawanController.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllKaryawan);
router.post("/createKaryawan", createKaryawan);

export default router;
