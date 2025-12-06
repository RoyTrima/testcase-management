import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from './routes/authRoutes.js';
import loginRoutes from "./routes/loginRoutes.js";
import testcaseRoutes from "./routes/testcaseRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Middleware JSON
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// Routes
app.use('/api/auth', authRoutes);       // <-- benar urutannya
app.use("/api/login", loginRoutes);
app.use("/api/testcases", testcaseRoutes);

// Default to login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/pages/login.html"));
});

export default app;
