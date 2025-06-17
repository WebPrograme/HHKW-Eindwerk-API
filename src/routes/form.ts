import { Router } from 'express';

import form from '../controllers/form';

const router = Router();

// Requests
router.post('/submit', form.submitForm); // Submit Form
router.post('/newsletter/subscribe', form.subscribeNewsletter); // Subscribe to Newsletter
router.post('/newsletter/unsubscribe', form.unsubscribeNewsletter); // Unsubscribe from Newsletter
router.get('/newsletter/subscriptions', form.getNewsletterSubscriptions); // Get All Newsletter Subscriptions

export default router;
