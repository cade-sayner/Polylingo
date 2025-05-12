import { Express, Request, Response } from 'express';
import { WordRepository } from '../repositories/word-repository';
import {LanguageRepository} from "../repositories/language-repository";

const wordRepo = new WordRepository();
const languageRepo = new LanguageRepository("languages", "language_id");
import { Word, WordResponse } from '../lib/types';

export function registerWordRoutes(app: Express) {
    app.get('/api/words', getAllWords);
    app.get('/api/words/:id', getWordById);
    app.post('/api/words', createWord);
    app.delete('/api/words/:id', deleteWord);
    app.get('/api/words/language/:id', getAllWordsByLanguage);
    app.put('/api/words/:id', updateWord);
}

async function getAllWords(req: Request, res: Response) {
    try {
        const words = await wordRepo.getAll();
        const wordResponses = await Promise.all(words.map(word => transformWordToResponse(word)));
        res.status(200).json(wordResponses);
    } catch (e) {
        res.status(500).json({ message: "Error fetching words." });
    }
}

async function getWordById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const word = await wordRepo.getByID(id);
        const wordResponse = await transformWordToResponse(word);
        //if (!word) return res.status(404).json({ message: "Word not found." });
        res.status(200).json(wordResponse);
    } catch (e) {
        res.status(500).json({ message: "Error fetching word." });
    }
}

async function createWord(req: Request, res: Response) {
    try {
        const created = await wordRepo.create(req.body);
        const createdWordResponse =  await Promise.all(created.map(word => transformWordToResponse(word)));
        res.status(201).json(createdWordResponse);
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
        const wordResponses = await Promise.all(words.map(word => transformWordToResponse(word)));
        res.status(200).json(wordResponses);
    } catch (e) {
        res.status(500).json({ message: "Error fetching words." });
    }
}

async function updateWord(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updatedData: Partial<Word> = req.body;

    try {
        const existingWord = await wordRepo.getByID(id);
        if (!existingWord) {
            return res.status(404).json({ message: "Word not found." });
        }

        // Ensure the update uses the correct ID
        const updatedWord = { ...existingWord, ...updatedData, wordId: id };

        const result = await wordRepo.update(id, updatedWord);
        const updatedResponse = await transformWordToResponse(result);

        res.status(200).json(updatedResponse);
    } catch (e: any) {
        if (e.message.includes("duplicate key")) {
            res.status(409).json({ message: "Word already exists for this language." });
        } else {
            res.status(500).json({ message: "Error updating word." });
        }
    }
}


async function transformWordToResponse(word: Word): Promise<WordResponse> {
  const language = await languageRepo.getByID(word.languageId);
  return {
    wordId: word.wordId ?? -1,
    word: word.word,
    languageName: language?.name ?? "Unknown"
  }
}