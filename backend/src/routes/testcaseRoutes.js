import express from 'express';
import { getTestcases, getTestcaseById, createTestcase, updateTestcase, deleteTestcase } from '../controllers/testcaseController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Semua route butuh login
router.use(authMiddleware);

router.get('/', getTestcases);
router.get('/:id', getTestcaseById);
router.post('/', createTestcase);
router.put('/:id', updateTestcase);
router.delete('/:id', deleteTestcase);

export default router;
