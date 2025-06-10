import { Router } from 'express';

import form from '../controllers/form';

const router = Router();

// Requests
router.post('/submit', form.submitForm); // Submit Form

export default router;
