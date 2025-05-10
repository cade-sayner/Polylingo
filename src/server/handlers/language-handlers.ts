import express, { Express, Request } from 'express';
import {LanguageRepository} from "../repositories/language-repository";
import { Languages } from '../lib/types';

const languageRepo = new LanguageRepository("languages", "language_id");

export function registerLanguageRoutes(app: Express) {
    app.use(express.json());
    app.get("/api/languages", getLanguages);
    app.get("/api/language/:id", getLanguageById);
    app.post("/api/language", createLanguage);
    app.delete("/api/language/:id", deleteLanguageById);
    app.put("/api/language/:id", updateLanguageById);
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
        let language_id = req.params.id as string;
        let language = (await languageRepo.getByID(parseInt(language_id)));

        if (!language) {
            return res.status(200).json({})
        }
        return res.status(200).json(await languageRepo.getByID(parseInt(language_id)));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "An error occurred while trying to fetch languages."});
    }
}

async function updateLanguageById(req: Request, res: any) {

    try {
        let language_id = req.params.id as string;
        let language = (await languageRepo.getByID(parseInt(language_id)));

        if (!language) {
            return res.status(400).json({message: `Language with id = ${language_id} not found`, language_id})
        }

        let languageName = req.body?.language_name as string;

        if( !languageName){
            return res.status(400).json({message: "Missing request body object field language_name"})
        }
        let newLanguage : Languages = {
            language_id: parseInt(language_id),
            language_name: languageName
        }

        return res.status(200).json(await languageRepo.update(parseInt(language_id), newLanguage));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({message: "An error occurred while trying to update language."});
    }
}

async function deleteLanguageById(req: Request, res: any) {

    try {
        let language_id = req.params.id as string;
        let language = (await languageRepo.getByID(parseInt(language_id)));

        if (!language) {
            return res.status(400).json({message: `Language with id = ${language_id} not found`, language_id})
        }

        return res.status(200).json(await languageRepo.deleteByID(parseInt(language_id)));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({message: "An error occurred while trying to update language."});
    }
}

async function createLanguage(req: Request, res: any) {

    try {
        console.log(req.body);
        let languageName = req.body?.language_name;

        if( !languageName){
            return res.status(400).json({message: "Missing request body object field language_name"})
        }
        let language : Languages = {
            language_id: null as unknown as number,
            language_name: languageName
        }

        return res.status(201).json(await languageRepo.create(language));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({message: "An error occurred while trying to add language."});
    }
}