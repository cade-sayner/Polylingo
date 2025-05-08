import { Express, Request } from 'express';
import { TranslationQuestionsAuditRepository } from '../repositories/translations-audit-repository';
import { authenticate } from '../lib/authentication';
import { UserRepository } from '../repositories/user-repository';

const translationAuditRepo = new TranslationQuestionsAuditRepository("translation_questions_audit", "translation_questions_audit_id");
const userRepo = new UserRepository("users", "user_id")

export function registerTranslationAuditRoutes(app: Express) {
    app.post('/api/audit/translation', authenticate, createTranslationAudit);
    app.get('/api/audit/translation', authenticate, getUserTranslationAudits);
}

async function createTranslationAudit(req: Request, res: any) {
    try {
        let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
        if (user == null || user.userId == null) {
            return res.status(500).json({ message: "Logged in user could not be found" });
        }
        let userId = user.userId;
        const { translationQuestionId, answerCorrect } = req.body;

        if (!translationQuestionId || answerCorrect === undefined) {
            return res.status(400).json({ message: 'Missing required fields: translationQuestionId or answerCorrect' });
        }

        const record = await translationAuditRepo.create({
            userId: userId,
            translationQuestionId: translationQuestionId,
            timeAttempted: new Date(),
            answerCorrect: answerCorrect
        });

        return res.status(201).json(record);
    } catch (e) {
        console.error("Error creating translation audit:", e);
        return res.status(500).json({ message: 'An error occurred while trying to create the audit record.' });
    }
}

async function getUserTranslationAudits(req: Request, res: any) {
    try {
        let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
        if (user == null || user.userId == null) {
            return res.status(500).json({ message: "Logged in user could not be found" });
        }
        const records = await translationAuditRepo.getByID(user.userId);

        return res.status(200).json(records);
    } catch (e) {
        console.error("Error fetching translation audits:", e);
        return res.status(500).json({ message: 'An error occurred while fetching audit records.' });
    }
}

function getGoogleId(req: Request) {
    return (req?.user as { googleId: string })?.googleId;
}
