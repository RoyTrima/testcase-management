import express from "express";
import auth from "../middleware/auth.js";
import {
  getProjects,
  getProjectById,
  createProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.post("/", auth, createProject);

export default router;
