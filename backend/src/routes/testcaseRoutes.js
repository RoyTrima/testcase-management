import express from 'express';
import { getTestcases, createTestcase, updateTestcase, deleteTestcase } from '../controllers/testcaseController.js';

const router = express.Router();

router.get('/', getTestcases);
router.post('/', createTestcase);
router.put('/:id', updateTestcase);
router.delete('/:id', deleteTestcase);

export default router;
