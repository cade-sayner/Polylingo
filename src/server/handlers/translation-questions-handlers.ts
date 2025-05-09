import express, { Express, Request } from 'express';
import { UserRepository } from '../repositories/user-repository';
import { TranslationQuestionRepository} from '../repositories/translation-questions-repository';
import { WordRepository} from '../repositories/word-repository';
import { authenticate } from '../lib/authentication';
import { TranslationQuestion } from '../lib/types';

const userRepo = new UserRepository("users", "user_id")
const translationQuestionsRepo = new TranslationQuestionRepository("translation_questions", "translation_question_id");
const wordRepo = new WordRepository("words", "word_id");

export function registerTranslationQuestionsRoutes(app: Express) {
    app.use(express.json());
    app.get("/api/translationquestions", getTranslationQuestions);
    app.get("/api/translationquestions/user", authenticate, getQuestionForUser);
    app.post("/api/translationquestions", authenticate, createTranslationQuestion);
    app.put("/api/translationquestions/:id", authenticate, updateTranslationQuestion);
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

async function getQuestionForUser(req: Request, res: any) {
    try {
        const userId = req.query.googleId as string;
        const language = req.query.language as string;
        const difficulty = req.query.difficulty as string;
        
        if (!userId) {
            return res.status(400).json({message: "User ID is required"});
        }
        if (!language) {
            return res.status(400).json({message: "Language is required"});
        }

        const languageNum = parseInt(language);
        const difficultyNum = difficulty ? parseInt(difficulty) : undefined;
        const userIdNum = parseInt(userId);

        const user = await userRepo.getByID(userIdNum);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        
        const question = await translationQuestionsRepo.getQuestionForUser(userId, languageNum, difficultyNum);
        
        if (question == null) {
            return res.status(404).json({message: "No available questions found for the given criteria"});
        }
        
        return res.status(200).json(question);
    }
    catch(e) {
        return res.status(500).json({message: "An error occurred while retrieving a question for the user."});
        // TODO : log the error here
    }
}


async function createTranslationQuestion(req: Request, res: any) {
    try {
        // Check if user is instructor

        const promptWordId = req.body.promptWordId;
        const answerWordId = req.body.answerWordId;
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

async function updateTranslationQuestion(req: Request, res: any) {
    try {
        // Check if user is instructor
        
        const questionId = parseInt(req.params.id);
        const promptWordId = req.body.promptWordId;
        const answerWordId = req.body.answerWordId;
        const distractors = req.body.distractors;
        const difficultyScore = req.body.difficultyScore;
        
        const existingQuestion = await translationQuestionsRepo.getByID(questionId);
        if (!existingQuestion) {
            return res.status(404).json({message: "Translation question not found"});
        }

        if (promptWordId !== undefined) {
            const promptWord = await wordRepo.getByID(promptWordId);
            if (!promptWord) {
                return res.status(404).json({message: "Prompt word not found"});
            }
        }

        if (answerWordId !== undefined) {
            const answerWord = await wordRepo.getByID(answerWordId);
            if (!answerWord) {
                return res.status(404).json({message: "Answer word not found"});
            }
        }

        if (distractors !== undefined) {
            if (!Array.isArray(distractors)) {
                return res.status(400).json({message: "Distractors must be an array"});
            }
        }
        
        if (difficultyScore !== undefined && (difficultyScore < 1 || difficultyScore > 10)) {
            return res.status(400).json({message: "Difficulty score must be between 1 and 10"});
        }

        const updatedQuestion: TranslationQuestion = {
            ...existingQuestion,
            promptWord: promptWordId !== undefined ? promptWordId : existingQuestion.promptWord,
            answerWord: answerWordId !== undefined ? answerWordId : existingQuestion.answerWord,
            distractors: distractors !== undefined ? distractors : existingQuestion.distractors,
            difficultyScore: difficultyScore !== undefined ? difficultyScore : existingQuestion.difficultyScore
        };

        if (updatedQuestion.promptWord === updatedQuestion.answerWord) {
            return res.status(400).json({message: "Prompt word and answer word must be different"});
        }
        
        const answerWord = await wordRepo.getByID(updatedQuestion.answerWord);
        const answerWordText = answerWord?.word || '';
        if (updatedQuestion.distractors.includes(answerWordText)) {
            return res.status(400).json({message: "Distractors should not include the answer word"});
        }

        const result = await translationQuestionsRepo.update(questionId, updatedQuestion);

        return res.status(200).json(result);
    }
    catch(e) {
        return res.status(500).json(e);
        // TODO : log the error here
    }
}