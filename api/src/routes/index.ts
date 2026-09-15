import { Router } from 'express';
import healthRoutes from './health.routes';
import schoolClassRoutes from './schoolClass.routes';
import studentRoutes from './student.routes';
import attendanceRoutes from './attendance.routes';
import triggerRoutes from './trigger.routes';
import concernRoutes from './concern.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/classes', schoolClassRoutes);
router.use('/students', studentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/triggers', triggerRoutes);
router.use('/concerns', concernRoutes);

export default router;
