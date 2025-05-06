import express, { Express, Request } from 'express';
import { UserRepository } from '../repositories/user-repository';
import { RoleRepository } from '../repositories/role-repository';
import { TranslationQuestionRepository} from '../repositories/translation-questions-repository';
import { authenticate } from '../lib/authentication';

const userRepo = new UserRepository("users", "user_id")
const roleRepo = new RoleRepository("roles", "id");
const translationQuestionsRepo = new TranslationQuestionRepository("translation_questions", "translation_question_id");

export function registerTranslationQuestionsRoutes(app: Express) {
    app.get("/api/translationquestions", getTranslationQuestions);
}

async function getTranslationQuestions(req: Request, res: any) {
    try {
        let translationQuestions = await translationQuestionsRepo.getAll();
        return res.status(200).json(translationQuestions);
    }
    catch(e){
        return res.status(500).json({message: "An error occurred while trying to fetch translation questions."});
        // TODO : log the error here
    }
}

// Get one for user with query parameters -> which user, which language, which difficulty

// Create -> promptWordId, answerWordId, distractors, difficulty score
//              - authenticate to be instructor
//              - check if promptword and answerword exist.
//              - check if they differ
//              - check if distractors different from answerword
//              - check if difficulty score is within bounds

// Update -> promptWordId, answerWordID, distractors, difficulty score - all optional
//              - authenticate to be instructor
//              - check if promprword and answerword exist if provided
//              - check if they differ after possible changes
//              - check if distractors differe after possible changes
//              - check if difficulty score is within bounds if provided


// async function getUserRole(req: Request, res: any) {
//     try {
//         let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
//         if (user == null) {
//             return res.status(404).json({ message: "Logged in user could not be found" });
//         }
//         let roleId = user.roleId as number;
//         let role = await roleRepo.getByID(roleId);
//         if (role == null) {
//             return res.status(404).json({ message: "Role for user could not be found" });
//         }
//         return res.status(200).json(role);
//     } catch (e) {
//         return res.status(500).json({ message: "An error occured while trying to fetch roles."});
//         // TODO: Log the exception here
//     }
// }

// async function getUser(req: Request, res: any) {
//     try{
//     let googleId = req.query.googleId as string | undefined;
//     if (!googleId) {
//         return res.status(400).json({
//             message: 'Missing required query parameter: googleId'
//         });
//     }
//     const exists = await userRepo.Exists(googleId);
//     if (!exists) {
//         return res.status(404).json({
//             message: 'User does not exist'
//         });
//     }
//     return res.status(200).json(await userRepo.getByColumnName("googleId", String(googleId)));
//     }catch(e){
//         return res.status(500).json({message: "An error occured while trying to fetch user."});
//         // TODO : log the error here
//     }
// }

// function getGoogleId(req: Request) {
//     return (req?.user as { googleId: string })?.googleId;
// }