import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bookRoutes from './routes/bookRoutes';
import noteRoutes from './routes/noteRoutes';
import userRoutes from './routes/userRoutes';



const app = express();

app.use(cors({
<<<<<<< HEAD
  origin: 'https://libararary.netlify.app',
}));
=======
  origin: 'https://your-site-name.netlify.app', // Replace with your actual Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],    // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // If you use cookies or auth headers
}));

>>>>>>> 0a5b593 (idk anymore)
const prisma = new PrismaClient();

app.use(express.json());

app.use('/api/users', userRoutes);
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