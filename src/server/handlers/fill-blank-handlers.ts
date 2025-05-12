
import { Express, Request } from 'express';
import { authenticate } from '../lib/authentication';
import { FillBlankRepository } from '../repositories/fill-blank-repository';
import { FillBlankQuestion, Language } from '../lib/types';
import { hasKeys } from '../lib/type-helpers';
import {UserRepository} from '../repositories/user-repository'

const fillBlankRepo = new FillBlankRepository("fill_blank_questions", "fill_blank_questions_id");
let languages = ["German", "Afrikaans", "Spanish", "Italian", "French"]

const userRepo = new UserRepository("users", "user_id");

export function registerFillBlankRoutes(app: Express) {
    app.get("/api/fill_blank/user", authenticate, getFillBlankUser);
    app.get("/api/fill_blank", authenticate, getFillBlanks)
    app.put("/api/fill_blank/:id", authenticate, putFillBlank);
    app.post("/api/fill_blank", authenticate, postFillBlank);
}

async function getFillBlanks(req:Request, res:any){
    try{
        return res.status(200).json(await fillBlankRepo.getAll());
    }catch(e){
        console.error((e as Error).message);
        return res.status(500).json({message : "Something went wrong getting fill blank questions"});
    }
}

async function getFillBlankUser(req: Request, res: any) {
    try {
        let language = req.query?.language;
        if (!language) { return res.status(400).json({ message: "Missing required parameter: language" }) };
        if (!languages.includes(language as string)) {
            return res.status(400).json({ message: "Language not supported" })
        }
        const user = await userRepo.getByColumnName("googleId", (req.user as {googleId : string}).googleId);
        if(!user) return null;
        let easiestUnansweredQuestion = await fillBlankRepo.getEasiestUnanswered(language as Language, user.userId as number);
        // if there is an unanswered question then get it
        if(easiestUnansweredQuestion){
            return res.status(200).json(easiestUnansweredQuestion);
        }

        // return a random question for the language otherwise
        return res.status(200).json(await fillBlankRepo.getFillBlankByLanguage(language as Language));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "An error occured while trying to fetch roles." });
    }
}

async function postFillBlank(req: Request, res: any) {
    try {
        if (!hasKeys(req.body,
            [
                { name: "placeholderSentence", type: "string" },
                { name: "missingWordId", type: "number" },
                { name: "difficultyScore", type: "number" },
                
            ])) {
            return res.status(400).json({ message: "Body of request malformed. " });
        }
        if (!Array.isArray(req.body?.distractors)) {
            return res.status(400).json({ message: "Distractors must be an array of strings." });
        }
        if(await fillBlankRepo.Exists(req.body as FillBlankQuestion)){
            return res.status(409).json("The question already exists");
        }

        return res.status(201).json(await fillBlankRepo.create(req.body as FillBlankQuestion));
    }catch(e){
        console.error((e as Error).message);
        return res.status(500).json({message : "Error creating fill blank question"});
    }
}

async function putFillBlank(req: Request, res: any) {
    try {
        if (!req?.params?.id) {
            return res.status(400).json({ message: "Required field 'id' not found" })
        }
        const id = parseInt(req.params.id as string);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "Required field id not of the expected type 'number'" });
        }
        if (!hasKeys(req.body,
            [
                { name: "placeholderSentence", type: "string" },
                { name: "missingWordId", type: "number" },
                { name: "difficultyScore", type: "number" },
                { name: "distractors", type: "object" }
            ])) {
            return res.status(400).json({ message: "Body of request malformed. " });
        }

        if (!Array.isArray(req.body?.distractors)) {
            return res.status(400).json({ message: "Distractors must be an array of strings." });
        }
        if(! (await fillBlankRepo.getByID(id))){return res.status(404).json("The question does not exist")}
        return res.status(200).json(await fillBlankRepo.update(id, req.body));
    }
    catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "Something went wrong updating a fill blank question." })
    }
}




