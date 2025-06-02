import { Router } from 'express';

import auth from '../middleware/auth';
import archive from '../controllers/archive';

const router = Router();

// Requests
router.get('/all', archive.getAllArticles); // Get All Articles
router.get('/timeline', archive.getTimelineArticles); // Get Timeline Articles
router.get('/:id', archive.getArticle); // Get Article by ID
router.post('/add', auth.validateToken, archive.addArticle); // Add Article (Private)
router.post('/update/:id', auth.validateToken, archive.updateArticle); // Update Article (Private)
router.post('/delete', auth.validateToken, archive.deleteArticles); // Delete Articles (Private)

export default router;
