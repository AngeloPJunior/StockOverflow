import { Router } from 'express';
import * as ctrl from '../controllers/reports.js';

const router = Router();
router.get('/estoque', ctrl.estoque);

export default router;
