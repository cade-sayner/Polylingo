import express, { Express, Request } from 'express';
import {WordRepository} from "../repositories/word-repository";
import { Word } from '../lib/types';
import { authenticate, authorize, getGoogleId } from '../lib/authentication';
import { UserRepository } from '../repositories/user-repository';

const wordRepo = new WordRepository("words", "word_id");
const userRepo = new UserRepository("users", "user_id")

export function registerLanguageRoutes(app: Express) {
    app.use(express.json());
    app.get("/api/word", authenticate, authorize(['USER', 'INSTRUCTOR']), getWords);
    app.get("/api/language/:id", authenticate, authorize(['USER', 'INSTRUCTOR']), getWordById);
}

async function getWords(req: Request, res: any) {
    try {
        let words;
        let wordSearchText = req.query.wordSearchText as string;
        let languageId = req.query.languageId as string;

        if (languageId && wordSearchText) {
            words = await wordRepo.searchWord(parseInt(languageId), wordSearchText);
        }
        else {
            words = await wordRepo.getAll();
        }

        return res.status(200).json(words);
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "An error occurred while trying to fetch languages."});
    }
}

async function getWordById(req: Request, res: any) {
    try {
        let wordId = req.params.id as string;
        let word = (await wordRepo.getByID(parseInt(wordId)));

        if (!word) {
            return res.status(200).json("Word id could not be found.")
        }
        return res.status(200).json(await wordRepo.getByID(parseInt(wordId)));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "An error occurred while trying to fetch words."});
    }
}