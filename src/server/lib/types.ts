export type User = {
    userId : number | null;
    googleId: string;
    email: string;
    name: string;
    roleId : number;
};

export type Role = {
    id : number | null;
    role : string;
}

export type TranslationQuestionsAudit = {
    translationQuestionsAuditId?: number;
    userId: number;
    translationQuestionId: number;
    timeAttempted: Date;
    answerCorrect: boolean;
};

export type FillBlankQuestionsAudit = {
    fillBlankQuestionsAuditId?: number;
    userId: number;
    fillBlankQuestionId: number;
    timeAttempted: Date;
    answerCorrect: boolean;
};
