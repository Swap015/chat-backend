import express from 'express';
import { uploadMiddleware, uploadImage } from '../controller/uploadController.js';

const router = express.Router();

// POST /api/cloud-upload
router.post('/cloud-upload', uploadMiddleware, uploadImage);

export default router;
