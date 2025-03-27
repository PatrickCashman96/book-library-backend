import express, { RequestHandler, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use .env in production

// Register
router.post('/register', (async (req:Request, res:Response) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: { id: user.id, email: user.email, username: user.username }, token });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
}) as RequestHandler);

// Login
router.post('/login', (async (req:Request, res:Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ user: { id: user.id, email: user.email, username: user.username }, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}) as RequestHandler);

// Verify
router.get('/verify', (req: Request, res, Response)=>{
  const authHeader = req.headers.authorization;
  
  if (!authHeader){
    return res.status(401).json({error: 'Authorization header missing'});
  }

  const token = authHeader.split(' ')[1];

  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded token:",decoded)
    res.json({valid: true, decoded});
  }catch(error){
    res.status(401).json({error: 'Invalid or expired token'});
  }
})
export default router;