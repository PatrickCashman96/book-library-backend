import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bookRoutes from './routes/bookRoutes';
import noteRoutes from './routes/noteRoutes';
import userRoutes from './routes/userRoutes';
import morgan from "morgan";



const app = express();
app.use(morgan("combined"));


app.use(
  cors({
    origin: "https://libararary.netlify.app", 
    credentials: true,
  })
);


app.options("*", cors());


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