import express, { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all books
router.get('/', (async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: { notes: true },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}) as RequestHandler);

// GET a single book by ID
router.get('/:id', (async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: { notes: true },
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
}) as RequestHandler);

// POST a new book
router.post('/', (async (req, res) => {
  const { title, author, genre, year } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  try {
    const book = await prisma.book.create({
      data: { title, author, genre, year },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create book' });
  }
}) as RequestHandler);

// PUT (update) a book by ID
router.put('/:id', (async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, year } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: { title, author, genre, year },
    });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update book' });
  }
}) as RequestHandler);

// DELETE a book by ID
router.delete('/:id', (async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete book' });
  }
}) as RequestHandler);

export default router;