import express from 'express';
import { registerUser, loginUser, guestLogin, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/guest', guestLogin);
router.get('/me', protect, getMe);

export default router;