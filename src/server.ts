import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bookRoutes from './routes/bookRoutes';
import noteRoutes from './routes/noteRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});