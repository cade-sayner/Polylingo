import { Express, Request, Response } from 'express';
import { FillBlankQuestionsAuditRepository } from '../repositories/fill-blank-questions-audit-repository';

const auditRepo = new FillBlankQuestionsAuditRepository();

export function registerFillBlankQuestionsAuditRoutes(app: Express) {
    app.get('/api/fill-blank-audit', getAllAudits);
    app.get('/api/fill-blank-audit/:id', getAuditById);
    app.post('/api/fill-blank-audit', createAudit);
    app.delete('/api/fill-blank-audit/:id', deleteAudit);
    app.get('/api/fill-blank-audit/user/:id', getAuditByUser);
}

async function getAllAudits(req: Request, res: Response) {
    try {
        const rows = await auditRepo.getAll(); 
        res.status(200).json(rows);
    } catch (e) {
        res.status(500).json({ message: "Error fetching audit records." });
    }
}

async function getAuditById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const audit = await auditRepo.getByID(id);
        //if (!audit) return res.status(404).json({ message: "Audit not found." });
        res.status(200).json(audit);
    } catch (e) {
        res.status(500).json({ message: "Error fetching audit." });
    }
}

async function createAudit(req: Request, res: Response) {
    try {
        console.log(req.body);
        const newAudit = await auditRepo.create(req.body);
        res.status(201).json(newAudit);
    } catch (e) {
        res.status(500).json({ message: "Error creating audit." });
    }
}

async function deleteAudit(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const deleted = await auditRepo.deleteByID(id);
        //if (!deleted) return res.status(404).json({ message: "Audit not found." });
        res.status(200).json(deleted);
    } catch (e) {
        res.status(500).json({ message: "Error deleting audit." });
    }
}

async function getAuditByUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
        const audits = await auditRepo.getAllByColumnName("userId",id);
        //if (!audit) return res.status(404).json({ message: "Audit not found." });
        res.status(200).json(audits);
    } catch (e) {
        res.status(500).json({ message: "Error fetching audit." });
    }
}