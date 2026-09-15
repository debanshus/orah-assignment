import { Router } from 'express';
import { createTrigger, getTriggers } from '../controllers/trigger.controller';

const router = Router();

router.post('/', createTrigger);
router.get('/', getTriggers);

export default router;
