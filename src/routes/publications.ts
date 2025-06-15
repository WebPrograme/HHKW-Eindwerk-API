import { Router } from 'express';

import auth from '../middleware/auth';
import publications from '../controllers/publications';

const router = Router();

// Requests
router.get('/all', publications.getAllPublications); // Get All Publications
router.post('/add', auth.validateToken, publications.addPublication); // Add Publication (Private)
router.post('/update', auth.validateToken, publications.updatePublication); // Update Publication (Private)
router.post('/delete', auth.validateToken, publications.deletePublication); // Delete Publication (Private)

export default router;
