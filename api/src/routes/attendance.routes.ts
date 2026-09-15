import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';

const router = Router();

/**
 * @openapi
 * /attendance:
 *   post:
 *     summary: Post attendance
 *     responses:
 *       201:
 *         description: Success
 *   get:
 *     summary: Get attendance
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/', AttendanceController.postAttendance);
router.get('/', AttendanceController.getAttendance);

export default router;
