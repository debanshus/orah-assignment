import { Router } from 'express';
import { ConcernController } from '../controllers/concern.controller';

const router = Router();

router.get('/', ConcernController.getAll);
router.patch('/:id', ConcernController.update);

export default router;
