import { Router } from 'express';

import auth from '../middleware/auth';
import contact from '../controllers/contact';

const router = Router();

// Requests
router.get('/all', contact.getAllSections); // Get All Sections
router.post('/add/section', auth.validateToken, contact.addSection); // Add Group (Private)
router.post('/update/section/:id', auth.validateToken, contact.updateSection); // Update Group (Private)
router.post('/delete/section', auth.validateToken, contact.deleteSection); // Delete Person (Private)

export default router;
