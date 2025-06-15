import { Router } from 'express';

import auth from '../middleware/auth';
import logs from '../controllers/log';

const router = Router();

// Requests
router.get('/all', auth.validateToken, logs.getAllLogs); // Get All Logs (Private)
router.get('/:id', auth.validateToken, logs.getLog); // Get Log by ID (Private)

export default router;
