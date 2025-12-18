import express from "express";
import { getSuitesByProject } from "../controllers/suiteController.js";

const router = express.Router();

// GET /api/suites/:projectId
router.get("/:projectId", getSuitesByProject);

export default router;
