import express from "express";
import { loginController } from "../controllers/authController.js";
import { loginValidator, validate } from "../middleware/validator.js";

const router = express.Router();

router.post("/", loginValidator, validate, loginController);

export default router;
