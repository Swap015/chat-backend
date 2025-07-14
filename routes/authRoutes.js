import express from 'express';
import authController from '../controller/authController.mjs';
import { verifyToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();
const { register, login, logout, refresh, profile } = authController;

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/profile', verifyToken, profile);


export default router;