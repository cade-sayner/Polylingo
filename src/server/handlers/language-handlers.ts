import express, { Express, Request } from 'express';
import {LanguageRepository} from "../repositories/language-repository";
import { Languages } from '../lib/types';
import { authenticate, authorize, getGoogleId } from '../lib/authentication';
import { UserRepository } from '../repositories/user-repository';

const languageRepo = new LanguageRepository("languages", "language_id");
const userRepo = new UserRepository("users", "user_id")

export function registerLanguageRoutes(app: Express) {
    app.use(express.json());
    app.get("/api/languages", authenticate, authorize(['USER', 'INSTRUCTOR']), getLanguages);
    app.get("/api/language/:id", authenticate, authorize(['USER', 'INSTRUCTOR']), getLanguageById);
}

async function getLanguages(req: Request, res: any) {
    try {
        return res.status(200).json(await languageRepo.getAll());
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "An error occurred while trying to fetch languages."});
    }
}

async function getLanguageById(req: Request, res: any) {
    try {
        let languageId = req.params.id as string;
        let language = (await languageRepo.getByID(parseInt(languageId)));

        if (!language) {
            return res.status(200).json({})
        }
        return res.status(200).json(await languageRepo.getByID(parseInt(languageId)));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "An error occurred while trying to fetch languages."});
    }
}