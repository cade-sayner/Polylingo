
import { Express, Request } from 'express';
import { authenticate, authorize, getGoogleId} from '../lib/authentication';
import { FillBlankRepository } from '../repositories/fill-blank-repository';
import { FillBlankQuestion, Language } from '../lib/types';
import { hasKeys } from '../lib/type-helpers';
import {UserRepository} from '../repositories/user-repository'
import { WordRepository } from '../repositories/word-repository';

const fillBlankRepo = new FillBlankRepository("fill_blank_questions", "fill_blank_questions_id");
let languages = ["German", "Afrikaans", "Spanish", "Italian", "French"]

const userRepo = new UserRepository("users", "user_id");
const wordRepo = new WordRepository("words", "word_id");

export function registerFillBlankRoutes(app: Express) {
    app.get("/api/fill_blank", authenticate, authorize(['INSTRUCTOR']), getFillBlanks);
    app.get("/api/fill_blank/user", authenticate, authorize(['User', 'INSTRUCTOR']), getFillBlankUser);
    app.post("/api/fill_blank", authenticate, authorize(['INSTRUCTOR']), postFillBlank);
    app.delete("/api/fill_blank/:id", authenticate, authorize(['INSTRUCTOR']), deleteFillBlank);
}

async function getFillBlanks(req:Request, res:any){
    try{
        let fillBlankQuestions;
        let answerWordId = req.query.answerWordId as string;
        
        if (answerWordId) {
            if (Number.isNaN(parseInt(answerWordId))) {
                return res.status(401).json("Answer word id should be a valid number.")
            }
            fillBlankQuestions = await fillBlankRepo.getByAnswerWordId(parseInt(answerWordId));
            if (fillBlankQuestions) {
                fillBlankQuestions = await Promise.all(
                    fillBlankQuestions.map(async question => ({
                        ...question,
                        word: (await wordRepo.getByID(parseInt(answerWordId))).word
                    }))
                );
            }
        }
        else {
            fillBlankQuestions = await fillBlankRepo.getAll();
        }

        return res.status(200).json(fillBlankQuestions);
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
        const user = await userRepo.getByColumnName("googleId", getGoogleId(req));
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

async function deleteFillBlank(req: Request, res: any) {
    try {
        if(!req.params.id)
        {
            return res.status(400).json({message: "Missing path parameter: question id"});
        }
        const questionId = parseInt(req.params.id as string);

        if(await fillBlankRepo.getByID(questionId)){
            await fillBlankRepo.deleteByID(questionId);
            return res.status(201).json(`Fill blank question with id ${questionId} deleted successfully.`);
        }
        else {
            return res.status(404).json("The provided question id does not exist.");
        }

    }catch(e){
        console.error((e as Error).message);
        return res.status(500).json({message : "Error deleting fill blank question"});
    }
}


