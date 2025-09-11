import { Router } from 'express';
import * as ctrl from '../controllers/products.js';

const router = Router();
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);   // ⇦ novo
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
export default router;
