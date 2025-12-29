import express from "express";
import auth from "../middleware/auth.js";

import {
  createTestRun,
  getTestRunsByProject,
  getTestRunById,
  updateTestRunStatus,
  getTestRunSummary,
  completeTestRun,
} from "../controllers/testRunController.js";

import {
  addTestcasesToRun,
  getTestRunCases,
  updateTestRunCase,
} from "../controllers/testRunCaseController.js";

const router = express.Router();

/**
 * Test Runs
 */
router.post("/", auth, createTestRun);
router.get("/project/:projectId", auth, getTestRunsByProject);
router.get("/:id", auth, getTestRunById);
router.patch("/:id/status", auth, updateTestRunStatus);
router.get("/:id/summary", auth, getTestRunSummary);
router.patch("/:id/complete", auth, completeTestRun);

/**
 * Test Run Cases
 */
router.post("/:runId/cases", auth, addTestcasesToRun);
router.get("/:runId/cases", auth, getTestRunCases);
router.patch("/:runId/cases/:id", auth, updateTestRunCase);

export default router;
