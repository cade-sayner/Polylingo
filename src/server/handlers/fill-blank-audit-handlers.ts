import { Express, Request } from 'express';
import { FillBlankQuestionAuditRepository } from '../repositories/fill-blank-audit-repository';
import { authenticate } from '../lib/authentication';
import { UserRepository } from '../repositories/user-repository';

const fillBlankAuditRepo = new FillBlankQuestionAuditRepository("fill_blank_questions_audit", "fill_blank_questions_audit_id");
const userRepo = new UserRepository("users", "user_id")

export function registerFillBlankAuditRoutes(app: Express) {
    app.post('/api/audit/fill-blank', authenticate, createFillBlankAudit);
    app.get('/api/audit/fill-blank', authenticate, getUserFillBlankAudits);
}

async function createFillBlankAudit(req: Request, res: any) {
    try {
        let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
        if (user == null || user.userId == null) {
            return res.status(500).json({ message: "Logged in user could not be found" });
        }
        let userId = user.userId;
        const { fillBlankQuestionId, answerCorrect } = req.body;

        if (!fillBlankQuestionId || answerCorrect === undefined) {
            return res.status(400).json({ message: 'Missing required fields: fillBlankQuestionId or answerCorrect' });
        }

        const record = await fillBlankAuditRepo.create({
            userId: userId,
            fillBlankQuestionId: fillBlankQuestionId,
            timeAttempted: new Date(),
            answerCorrect: answerCorrect
        });

        return res.status(201).json(record);
    } catch (e) {
        console.error("Error creating fillBlank audit:", e);
        return res.status(500).json({ message: 'An error occurred while trying to create the audit record.' });
    }
}

async function getUserFillBlankAudits(req: Request, res: any) {
    try {
        let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
        if (user == null || user.userId == null) {
            return res.status(500).json({ message: "Logged in user could not be found" });
        }
        const records = await fillBlankAuditRepo.getByID(user.userId);

        return res.status(200).json(records);
    } catch (e) {
        console.error("Error fetching fill-blank audits:", e);
        return res.status(500).json({ message: 'An error occurred while fetching audit records.' });
    }
}

function getGoogleId(req: Request) {
    return (req?.user as { googleId: string })?.googleId;
}

import { Express, Request } from 'express';
import { FillBlankQuestionAuditRepository } from '../repositories/fill-blank-audit-repository';
import { authenticate, getGoogleId } from '../lib/authentication';
import { UserRepository } from '../repositories/user-repository';

const fillBlankAuditRepo = new FillBlankQuestionAuditRepository("fill_blank_questions_audit", "fill_blank_questions_audit_id");
const userRepo = new UserRepository("users", "user_id")

export function registerFillBlankAuditRoutes(app: Express) {
    app.post('/api/audit/fill-blank', authenticate, createFillBlankAudit);
    app.get('/api/audit/fill-blank', authenticate, getUserFillBlankAudits);
}

async function createFillBlankAudit(req: Request, res: any) {
    try {
        let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
        if (user == null || user.userId == null) {
            return res.status(500).json({ message: "Logged in user could not be found" });
        }
        let userId = user.userId;
        const { fillBlankQuestionId, answerCorrect } = req.body;
        if (!fillBlankQuestionId || answerCorrect === undefined) {
            return res.status(400).json({ message: 'Missing required fields: fillBlankQuestionId or answerCorrect' });
        }

        const record = await fillBlankAuditRepo.create({
            userId: userId,
            fillBlankQuestionId: fillBlankQuestionId,
            timeAttempted: new Date(),
            answerCorrect: answerCorrect
        });

        return res.status(201).json(record);
    } catch (e) {
        console.error("Error creating fillBlank audit:", e);
        return res.status(500).json({ message: 'An error occurred while trying to create the audit record.' });
    }
}

async function getUserFillBlankAudits(req: Request, res: any) {
    try {
        let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
        if (user == null || user.userId == null) {
            return res.status(500).json({ message: "Logged in user could not be found" });
        }
        const records = await fillBlankAuditRepo.getAllByColumnName("userId", user.userId);

        return res.status(200).json(records);
    } catch (e) {
        console.error("Error fetching fill-blank audits:", e);
        return res.status(500).json({ message: 'An error occurred while fetching audit records.' });
    }
}
