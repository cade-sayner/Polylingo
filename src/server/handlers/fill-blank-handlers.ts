
import { Express, Request } from 'express';
import { UserRepository } from '../repositories/user-repository';
import { RoleRepository } from '../repositories/role-repository'
import { authenticate } from '../lib/authentication';
import { FillBlankRepository } from '../repositories/fill-blank-repository';
import { Language } from '../lib/types';

const fillBlankRepo = new FillBlankRepository("fill_blank_questions", "fill_blank_questions_id");
let languages = ["German", "Afrikaans", "Spanish", "Italian", "French"]

export function registerFillBlankRoutes(app: Express) {
    app.get("/api/fill_blank", getFillBlank);
}

async function getFillBlank(req: Request, res: any) {
    try {
        let language = req.query?.language;
        if(!language){return res.status(400).json({message: "Missing required parameter: language"})};
        if(!languages.includes(language as string)){
            return res.status(400).json({message: "Language not supported"})
        }
    
        return res.status(200).json(await fillBlankRepo.getFillBlankByLanguage(language as Language));
    } catch (e) {
        console.error((e as Error).message);
        return res.status(500).json({ message: "An error occured while trying to fetch roles."});
    }
}


