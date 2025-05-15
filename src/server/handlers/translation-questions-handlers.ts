import express, { Express, Request } from 'express';
import { TranslationQuestionRepository} from '../repositories/translation-questions-repository';
import { WordRepository} from '../repositories/word-repository';
import { authenticate, authorize, getGoogleId } from '../lib/authentication';
import { TranslationQuestion } from '../lib/types';
import { UserRepository } from '../repositories/user-repository';

const translationQuestionsRepo = new TranslationQuestionRepository("translation_questions", "translation_question_id");
const wordRepo = new WordRepository("words", "word_id");
const userRepo = new UserRepository("users", "user_id");
export function registerTranslationQuestionsRoutes(app: Express) {
    app.use(express.json());
    app.get("/api/translationquestions", authenticate, authorize(['INSTRUCTOR']), getTranslationQuestions);
    app.get("/api/translationquestions/user", authenticate, authorize(['USER']), getQuestionForUser);
    app.post("/api/translationquestions", authenticate, authorize(['INSTRUCTOR']), createTranslationQuestion);
    app.delete("/api/translationquestions/:id", authenticate, authorize(['INSTRUCTOR']), deleteTranslationQuestion);

}

async function getTranslationQuestions(req: Request, res: any) {
    try {
        let translationQuestions;
        let answerWordId = req.query.answerWordId as string;
        if (answerWordId) {
            if (Number.isNaN(parseInt(answerWordId))) {
                return res.status(401).json("Answer word id should be a valid number.")
            }
            translationQuestions = await translationQuestionsRepo.getByAnswerWordId(parseInt(answerWordId));
        }
        else {
            translationQuestions = await translationQuestionsRepo.getAll();
        }
        return res.status(200).json(translationQuestions);
    }
    catch(e){
        console.error((e as Error).message);
        return res.status(500).json({message: "An error occurred while trying to fetch translation questions."});
    }
}

async function getQuestionForUser(req: Request, res: any) {
    try {
        const userGoogleId = getGoogleId(req);
        const promptLanguage = req.query.prompt_language as string;
        const answerLanguage = req.query.answer_language as string;
        const difficulty = req.query.difficulty as string | undefined;

        if (!promptLanguage) {
            return res.status(400).json({message: "Prompt Language is required"});
        }
        if (!answerLanguage) {
            return res.status(400).json({message: "Answer Language is required"});
        }

        if(difficulty !== undefined){
            if((Number.isNaN(parseInt(difficulty)) || parseInt(difficulty) > 10 || parseInt(difficulty) < 1)){
                return res.status(400).json({message : "Difficulty provided was not a number between 1 and 10"});
            }
            const question = await translationQuestionsRepo.getByLanguageAndDifficulty(promptLanguage, answerLanguage, userGoogleId, parseInt(difficulty))
            if(!question) 
                return res.status(404).json("No question matching the given criteria was found");
            
            return res.status(200).json(question);
        }
        else
        {
            const easiestUnansweredQuestion = await translationQuestionsRepo.getEasiestUnanswered(promptLanguage, answerLanguage, userGoogleId);
            if(easiestUnansweredQuestion)
                return res.status(200).json(easiestUnansweredQuestion);
            return res.status(200).json(await translationQuestionsRepo.getTranslationQuestionByLanguage(promptLanguage, answerLanguage));
        }
    }
    catch(e) {
        console.error((e as Error).message);
        return res.status(500).json({message: "An error occurred while retrieving a question for the user."});
    }
}

async function createTranslationQuestion(req: Request, res: any) {
    try {
        const promptWordId = req.body.promptWord;
        const answerWordId = req.body.answerWord;
        const distractors = req.body.distractors;
        const difficultyScore = req.body.difficultyScore;
        
        // Validate required fields
        if (!promptWordId || !answerWordId || !distractors || difficultyScore === undefined) {
            return res.status(400).json({message: "All fields are required: promptWordId, answerWordId, distractors, difficultyScore"});
        }
        
        // Validate promptWordId and answerWordId exist
        const promptWord = await wordRepo.getByID(promptWordId);
        const answerWord = await wordRepo.getByID(answerWordId);
        
        if (!promptWord) {
            return res.status(404).json({message: "Prompt word not found"});
        }
        
        if (!answerWord) {
            return res.status(404).json({message: "Answer word not found"});
        }
        
        if (promptWordId === answerWordId) {
            return res.status(400).json({message: "Prompt word and answer word must be different"});
        }
        
        if (!Array.isArray(distractors)) {
            return res.status(400).json({message: "Distractors must be an array"});
        }
        
        if (distractors.includes(answerWord.word)) {
            return res.status(400).json({message: "Distractors should not include the answer word"});
        }
        
        if (difficultyScore < 1 || difficultyScore > 10) {
            return res.status(400).json({message: "Difficulty score must be between 1 and 10"});
        }
        
        if(await translationQuestionsRepo.Exists(req.body)){
            return res.status(409).json({message : "The question already exists"});
        }
        const newQuestion: TranslationQuestion = {
            translationQuestionId: null,
            promptWord: promptWordId,
            answerWord: answerWordId,
            distractors: distractors,
            difficultyScore: difficultyScore
        };
        
        const createdQuestion = await translationQuestionsRepo.create(newQuestion);

        return res.status(201).json(createdQuestion);
    }
    catch(e) {
        // return res.status(500).json({message: "An error occurred while creating the translation question."});
        return res.status(500).json(e);
        // TODO : log the error here
    }
}

async function deleteTranslationQuestion(req: Request, res: any) {
    try {
        if(!req.params.id)
        {
            return res.status(400).json({message: "Missing path parameter: question id"});
        }
        const questionId = parseInt(req.params.id as string);

        if(await translationQuestionsRepo.getByID(questionId)){
            await translationQuestionsRepo.deleteByID(questionId);
            return res.status(201).json(`Translation question with id ${questionId} deleted successfully.`);
        }
        else {
            return res.status(404).json("The provided question id does not exist.");
        }

    }catch(e){
        console.error((e as Error).message);
        return res.status(500).json({message : "Error deleting translation question"});
    }
}
