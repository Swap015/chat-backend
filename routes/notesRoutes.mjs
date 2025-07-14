import Notes from '../controller/noteController.mjs';
import express from 'express';
import { verifyToken } from "../middleware/authMiddleware.mjs";

const { getNotes, addNotes } = Notes;
const router = express.Router();


router.get("/getNotes", verifyToken, getNotes);
router.post("/addNotes", verifyToken, addNotes);

export default router;