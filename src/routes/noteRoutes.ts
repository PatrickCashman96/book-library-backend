import express, { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/book/:bookId', (async (req, res) => {
  const { bookId } = req.params;
  try {
    const notes = await prisma.note.findMany({
      where: { bookId: Number(bookId) },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
}) as RequestHandler);

router.post('/book/:bookId', (async (req, res) => {
  const { bookId } = req.params;
  const { content, rating } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  try {
    const note = await prisma.note.create({
      data: { content, rating, bookId: Number(bookId) },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create note' });
  }
}) as RequestHandler);

router.put('/:id', (async (req, res) => {
  const { id } = req.params;
  const { content, rating } = req.body;
  try {
    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: { content, rating },
    });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update note' });
  }
}) as RequestHandler);

router.delete('/:id', (async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.note.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete note' });
  }
}) as RequestHandler);

export default router;