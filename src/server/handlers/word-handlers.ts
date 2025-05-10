import { Express, Request, Response } from 'express';
import { WordRepository } from '../repositories/word-repository';

const wordRepo = new WordRepository();

export function registerWordRoutes(app: Express) {
    app.get('/api/words', getAllWords);
    app.get('/api/words/:id', getWordById);
    app.post('/api/words', createWord);
    app.delete('/api/words/:id', deleteWord);
    app.get('/api/words/language/:id', getAllWordsByLanguage);
}

async function getAllWords(req: Request, res: Response) {
    try {
        const words = await wordRepo.getAll();
        //TODO: change words to WordResponse type
        res.status(200).json(words);
    } catch (e) {
        res.status(500).json({ message: "Error fetching words." });
    }
}

async function getWordById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const word = await wordRepo.getByID(id);
        //if (!word) return res.status(404).json({ message: "Word not found." });
        res.status(200).json(word);
    } catch (e) {
        res.status(500).json({ message: "Error fetching word." });
    }
}

async function createWord(req: Request, res: Response) {
    try {
        const created = await wordRepo.create(req.body);
        res.status(201).json(created);
    } catch (e: any) {
        if (e.message.includes("duplicate key")) {
            res.status(409).json({ message: "Word already exists for this language." });
        } else {
            res.status(500).json({ message: "Error creating word." });
        }
    }
}

async function deleteWord(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const deleted = await wordRepo.deleteByID(id);
        //if (!deleted) return res.status(404).json({ message: "Word not found." });
        res.status(200).json(deleted);
    } catch (e) {
        res.status(500).json({ message: "Error deleting word." });
    }
}

async function getAllWordsByLanguage(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const words = await wordRepo.getAllByColumnName("languageId",id);
        //TODO: change words to WordResponse type
        res.status(200).json(words);
    } catch (e) {
        console.error((e as Error).message);
        res.status(500).json({ message: "Error fetching words." });
    }
}