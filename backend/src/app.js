import express from "express";
import projectRoutes from "./routes/projectRoutes.js";
import suiteRoutes from "./routes/suiteRoutes.js";
import testcaseRoutes from "./routes/testcaseRoutes.js";

const app = express();
app.use(express.json());

// Register routes
app.use('/api/projects', projectRoutes);
app.use('/api/suites', suiteRoutes);
app.use('/api/testcases', testcaseRoutes);

export default app;
