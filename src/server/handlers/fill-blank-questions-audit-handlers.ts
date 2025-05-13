import { Express, Request, Response } from 'express';
import { FillBlankQuestionsAuditRepository } from '../repositories/fill-blank-questions-audit-repository';
import { FillBlankRepository } from '../repositories/fill-blank-repository';
import { FillBlankQuestionsAudit, FillBlankQuestionsAuditResponse } from '../lib/types';
import { UserRepository } from '../repositories/user-repository';
import { WordRepository } from '../repositories/word-repository';
import { authenticate } from '../lib/authentication';
import { error } from 'console';

const auditRepo = new FillBlankQuestionsAuditRepository();
const userRepo = new UserRepository("users", "user_id");
const wordRepo = new WordRepository("words", "word_id");
const questionRepo = new FillBlankRepository("fill_blank_questions", "fill_blank_question_id");

export function registerFillBlankQuestionsAuditRoutes(app: Express) {
    app.get('/api/fill-blank-audit', authenticate,getAllAudits);
    app.get('/api/fill-blank-audit/:id',authenticate, getAuditById);
    app.post('/api/fill-blank-audit',authenticate, createAudit);
    app.delete('/api/fill-blank-audit/:id',authenticate, deleteAudit);
    app.get('/api/fill-blank-audit/user/:id',authenticate, getAuditByUser);
    app.put('/api/fill-blank-audit/:id', updateAuditAnswerCorrect);
}

async function getAllAudits(req: Request, res: Response) {
    try {
        const rows = await auditRepo.getAll(); 
        const audits =await Promise.all( rows.map((row) => transformAuditToResponse(row)));
        res.status(200).json(audits);
    } catch (e) {
        res.status(500).json({ message: "Error fetching audit records." });
    }
}

async function getAuditById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const audit = await auditRepo.getByID(id);
        const auditResponse = await transformAuditToResponse(audit);
        //if (!audit) return res.status(404).json({ message: "Audit not found." });
        res.status(200).json(auditResponse);
    } catch (e) {
        res.status(500).json({ message: "Error fetching audit." });
    }
}

async function createAudit(req: Request, res: Response) {
    try {
        const auditData = {
            ...req.body,
            date: new Date() // Override with system date
        };
        const newAudit = await auditRepo.create(auditData);
        res.status(201).json(newAudit);
    } catch (e) {
        res.status(500).json({ message: "Error creating audit." });
    }
}

async function deleteAudit(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const deleted = await auditRepo.deleteByID(id);
        const auditResponse = await transformAuditToResponse(deleted);
        //if (!deleted) return res.status(404).json({ message: "Audit not found." });
        res.status(200).json(auditResponse);
    } catch (e) {
        res.status(500).json({ message: "Error deleting audit." });
    }
}

async function getAuditByUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const audits = await auditRepo.getAllByColumnName("userId",id);
        const auditsResponse = await Promise.all(audits.map((audit) => transformAuditToResponse(audit)));
        //if (!audit) return res.status(404).json({ message: "Audit not found." });
        res.status(200).json(auditsResponse);
    } catch (e) {
        res.status(500).json({ message: "Error fetching audit." });
    }
}

async function transformAuditToResponse(
  audit: FillBlankQuestionsAudit
): Promise<FillBlankQuestionsAuditResponse> {
  const user = await userRepo.getByID(audit.userId);
  const question = await questionRepo.getByID(audit.fillBlankQuestionId);
  const word = await wordRepo.getByID(question?.missingWordId);
  console.log(question.missingWordId);

  return {
    fillBlankQuestionsAuditId: audit.fillBlankQuestionsAuditId,
    fillBlankQuestionId: audit.fillBlankQuestionId,
    userName: user?.name ?? "Unknown",
    placeholderSentence: question?.placeholderSentence ?? "Unknown question",
    timeAttempted: audit.timeAttempted,
    answerCorrect: audit.answerCorrect,
    correctWord: word?.word ?? "Unknown word",
  };
}

async function updateAuditAnswerCorrect(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { answerCorrect } = req.body;

    if (typeof answerCorrect !== "boolean") {
        //return res.status(400).json({ message: "answerCorrect must be a boolean." });
    }

    try {
        const existingAudit = await auditRepo.getByID(id);
        if (!existingAudit) {
            //return res.status(404).json({ message: "Audit not found." });
        }

        const updatedAudit = {
            ...existingAudit,
            answerCorrect: answerCorrect
        };

        const result = await auditRepo.update(id, updatedAudit);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: "Error updating audit." });
    }
}
