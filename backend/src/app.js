import express from "express";
import cors from "cors";
import testRunRoutes from "./routes/testRunRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import suiteRoutes from "./routes/suiteRoutes.js";
import testcaseRoutes from "./routes/testcaseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import testRunCaseRoutes from "./routes/testRunCaseRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Backend API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/suites", suiteRoutes);
app.use("/api/testcases", testcaseRoutes);
app.use("/api/test-runs", testRunRoutes);
app.use("/api/test-run-cases", testRunCaseRoutes);

export default app;
