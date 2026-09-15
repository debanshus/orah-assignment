import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns a health status message to confirm the API is running.
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/', HealthController.check);

export default router;
