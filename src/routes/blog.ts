import { Router } from 'express';

import auth from '../middleware/auth';
import blog from '../controllers/blog';

const router = Router();

// Requests
// Articles
router.get('/articles/all', blog.getAllArticles); // Get All Articles
router.get('/articles/:id', blog.getArticle); // Get Article by ID
router.post('/articles/add', auth.validateToken, blog.addArticle); // Add Article (Private)
router.post('/articles/update/:id', auth.validateToken, blog.updateArticle); // Update Article (Private)
router.post('/articles/delete', auth.validateToken, blog.deleteArticles); // Delete Articles (Private)
router.get('/articles/search/:q', blog.searchArticles); // Search Articles

// Events
router.get('/events/all', blog.getAllEvents); // Get All Events
router.get('/events/:id', blog.getEvent); // Get Event by ID
router.post('/events/add', auth.validateToken, blog.addEvent); // Add Event (Private)
router.post('/events/update/:id', auth.validateToken, blog.updateEvent); // Update Event (Private)
router.post('/events/delete', auth.validateToken, blog.deleteEvents); // Delete Events (Private)

export default router;
