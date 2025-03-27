"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authMiddleware);
router.get('/', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield prisma.book.findMany({
            where: { userId: req.user.id },
            include: { notes: true },
        });
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
})));
router.get('/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const book = yield prisma.book.findFirst({
            where: { id: Number(id), userId: req.user.id },
            include: { notes: true },
        });
        if (!book)
            return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
})));
router.post('/', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, genre, year } = req.body;
    if (!title || !author)
        return res.status(400).json({ error: 'Title and author required' });
    try {
        const book = yield prisma.book.create({
            data: {
                title,
                author,
                genre,
                year,
                userId: req.user.id,
            },
        });
        res.status(201).json(book);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create book' });
    }
})));
router.put('/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, author, genre, year } = req.body;
    try {
        const book = yield prisma.book.update({
            where: { id: Number(id), userId: req.user.id },
            data: { title, author, genre, year },
        });
        res.json(book);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update book' });
    }
})));
router.delete('/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.book.delete({
            where: { id: Number(id), userId: req.user.id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete book' });
    }
})));
exports.default = router;
