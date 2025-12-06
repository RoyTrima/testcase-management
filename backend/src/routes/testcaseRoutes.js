import express from 'express';
import { getTestcases, createTestcase, updateTestcase, deleteTestcase } from '../controllers/testcaseController.js';
import authMiddleware from '../middleware/auth.js';  // pastikan middleware JWT

const router = express.Router();

// Semua route butuh login
router.use(authMiddleware);

router.get('/', getTestcases);
router.post('/', createTestcase);
router.put('/:id', updateTestcase);
router.delete('/:id', deleteTestcase);

export default router;
