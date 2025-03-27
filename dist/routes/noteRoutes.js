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
router.get('/book/:bookId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    try {
        const notes = yield prisma.note.findMany({
            where: { bookId: Number(bookId), userId: req.user.id },
        });
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
})));
router.post('/book/:bookId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const { content, rating } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    try {
        const note = yield prisma.note.create({
            data: { content, rating, bookId: Number(bookId), userId: req.user.id },
        });
        res.status(201).json(note);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create note' });
    }
})));
router.put('/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content, rating } = req.body;
    try {
        const note = yield prisma.note.update({
            where: { id: Number(id), userId: req.user.id },
            data: { content, rating },
        });
        res.json(note);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update note' });
    }
})));
router.delete('/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.note.delete({
            where: { id: Number(id), userId: req.user.id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete note' });
    }
})));
exports.default = router;
