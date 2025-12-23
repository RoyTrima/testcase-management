import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/uploads.js";

import { exportTestcases } from "../controllers/testcaseExportController.js";
import { importTestcases } from "../controllers/testcaseImportController.js";

import {
  getTestcases,
  getTestcaseById,
  createTestcase,
  updateTestcase,
  deleteTestcase,
} from "../controllers/testcaseController.js";

const router = express.Router();

/**
 * EXPORT / IMPORT
 */
router.get("/export", auth, exportTestcases);
router.post("/import", auth, upload.single("file"), importTestcases);

/**
 * NORMAL CRUD
 */
router.get("/", auth, getTestcases);
router.get("/:id", auth, getTestcaseById);
router.post("/", auth, createTestcase);
router.put("/:id", auth, updateTestcase);
router.delete("/:id", auth, deleteTestcase);

export default router;
