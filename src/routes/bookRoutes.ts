import express, { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', (async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      where: { userId: req.user!.id },
      include: { notes: true },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}) as RequestHandler);

router.get('/:id', (async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findFirst({
      where: { id: Number(id), userId: req.user!.id },
      include: { notes: true },
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
}) as RequestHandler);

router.post('/', (async (req: Request, res: Response) => {
  const { title, author, genre, year } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title and author required' });
  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        genre,
        year,
        userId: req.user!.id,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create book' });
  }
}) as RequestHandler);

router.put('/:id', (async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, genre, year } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id: Number(id), userId: req.user!.id },
      data: { title, author, genre, year },
    });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update book' });
  }
}) as RequestHandler);

router.delete('/:id', (async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: Number(id), userId: req.user!.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete book' });
  }
}) as RequestHandler);

export default router;