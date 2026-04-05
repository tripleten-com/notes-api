import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notes.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/notes', getNotes);
router.post('/notes', createNote);

// TODO: Lesson 07 — protect this route with auth middleware
router.delete('/notes/:id', deleteNote);

export default router;
