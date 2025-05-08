import { BaseRepository } from "../lib/base-repository";
import { FillBlankQuestionsAudit } from "../lib/types";

class FillBlankQuestionsAuditRepository extends BaseRepository<FillBlankQuestionsAudit> {
    constructor() {
        super("fill_blank_questions_audit", "fill_blank_questions_audit_id");
    }
}

export const fillBlankQuestionsAuditRepo = new FillBlankQuestionsAuditRepository();
