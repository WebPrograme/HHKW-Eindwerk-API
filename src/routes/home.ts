import { Router } from 'express';

import auth from '../middleware/auth';
import home from '../controllers/home';

const router = Router();

// Requests
router.get('/blocks/all', home.getAllBlocks); // Get All Blocks
router.get('/blocks/:order', home.getBlock); // Get Block by Order
router.post('/blocks/update/:id', auth.validateToken, home.updateBlock); // Update Block (Private)

export default router;
