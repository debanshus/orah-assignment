import { Router } from 'express';
import { SchoolClassController } from '../controllers/schoolClass.controller';

const router = Router();

/**
 * @openapi
 * /classes:
 *   get:
 *     summary: Get all classes
 *     description: Returns a list of all school classes
 *     responses:
 *       200:
 *         description: Array of classes
 */
router.get('/', SchoolClassController.getAll);

export default router;
