import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Middleware JSON
app.use(express.json());

// Serve static frontend (optional, khusus HTML login)
app.use(express.static(path.join(__dirname, "../../frontend")));

// Routes
import loginRoutes from "./routes/loginRoutes.js";
app.use("/api/login", loginRoutes);

import testcaseRoutes from "./routes/testcaseRoutes.js";
app.use("/api/testcases", testcaseRoutes);

// Default to login page (HTML)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/pages/login.html"));
});

export default app;
