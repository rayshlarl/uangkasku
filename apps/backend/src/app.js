import express from "express";
import cors from "cors";
import karyawanRoutes from "./routes/karyawanRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/auth/login", loginRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;
