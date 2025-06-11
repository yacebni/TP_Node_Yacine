import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import { verifyToken, restrictTo } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

authRouter.post('/admin-signup', verifyToken, restrictTo('admin'), signup);

export { authRouter };