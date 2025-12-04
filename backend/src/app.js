import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware JSON
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// Testcase routes
import testcaseRoutes from "./routes/testcaseRoutes.js";
app.use("/api/testcases", testcaseRoutes);

// Default route ke login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/pages/login.html"));
});

export default app;
