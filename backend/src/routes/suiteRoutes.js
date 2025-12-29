import express from "express";
import auth from "../middleware/auth.js";
import {
  getSuitesByProject,
  getSuiteById,
  createSuite,
  getTestcasesBySuite,   
} from "../controllers/suiteController.js";

const router = express.Router();

router.get("/project/:projectId", auth, getSuitesByProject);
router.get("/:suiteId/testcases", auth, getTestcasesBySuite);

router.get("/:id", auth, getSuiteById);
router.post("/", auth, createSuite);

export default router;
