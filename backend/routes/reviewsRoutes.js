import express from 'express';
import auth from '../middleware/auth.js';
import { getReviews, addReview, deleteReview, getAllReview } from '../controllers/reviewController.js';
import { updateReview } from '../controllers/reviewController.js';

const router = express.Router();
router.use(auth);

router.get('/', getAllReview);
router.post('/add', addReview);

router.get('/:movieId', getReviews);
router.post('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);  
export default router;
