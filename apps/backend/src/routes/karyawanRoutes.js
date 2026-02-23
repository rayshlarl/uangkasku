import express from "express";
import {
  getAllKaryawan,
  createKaryawan,
} from "../controllers/karyawanController.js";
const abd = 0;

const router = express.Router();

router.get("/", getAllKaryawan);
router.post("/createKaryawan", createKaryawan);

export default router;
