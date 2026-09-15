import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router = Router();

/**
 * @openapi
 * /students:
 *   get:
 *     summary: Get all students
 *     description: Returns a list of all students
 *     responses:
 *       200:
 *         description: Array of students
 */
router.get('/', StudentController.getAll);

export default router;
