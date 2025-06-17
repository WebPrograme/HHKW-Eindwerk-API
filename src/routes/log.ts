import { Router } from 'express';

import auth from '../middleware/auth';
import logs from '../controllers/log';

const router = Router();

// Requests
router.get('/all', auth.validateToken, logs.getAllLogs); // Get All Logs (Private)
router.get('/', auth.validateToken, logs.getLogs); // Get Logs with Filtering (Private)

export default router;
