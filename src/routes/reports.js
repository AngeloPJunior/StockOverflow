
import { Router } from 'express';
import { estoque } from '../controllers/reports.js';

const router = Router();
router.get('/estoque', estoque);

export default router;
