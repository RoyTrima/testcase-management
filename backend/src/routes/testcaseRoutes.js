import express from "express";
import auth from "../middleware/auth.js";
import {
  getTestcases,
  getTestcaseById,
  createTestcase,
  updateTestcase,
  deleteTestcase,
} from "../controllers/testcaseController.js";

const router = express.Router();

router.get("/", auth, getTestcases);
router.get("/:id", auth, getTestcaseById);
router.post("/", auth, createTestcase);
router.put("/:id", auth, updateTestcase);
router.delete("/:id", auth, deleteTestcase);

export default router;
