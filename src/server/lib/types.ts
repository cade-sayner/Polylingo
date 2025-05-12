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

export type Language = "Afrikaans" | "Spanish" | "Italian" | "French" | "German";

export type LanguageModel = {
    languageId : number;
    languageName : Language
}

export type FillBlankQuestion = {
    fillBlankQuestionId : number | null;
    placeholderSentence : string;
    missingWordId : number;
    distractors : string[];
    difficultyScore : number;
}

export type FillBlankQuestionResponse = {
    fillBlankQuestionId : number;
    placeholderSentence : string;
    word : string;
    distractors : string[];
    difficultyScore : number;
}

export type PrimitiveTypes = "string" | "number" | "boolean" | "symbol" | "undefined" | "bigint" | "object" | "function";

export type FillBlankQuestionsAudit = {
    fillBlankQuestionsAuditId: number | null;
    userId: number;
    fillBlankQuestionId: number;
    timeAttempted: string;
    answerCorrect: boolean;
};

export type FillBlankQuestionsAuditResponse = {
    fillBlankQuestionsAuditId: number | null;
    fillBlankQuestionId: number;
    timeAttempted: string;
    answerCorrect: boolean;
    userName?: string;
    placeholderSentence?: string;
};

export type Word = {
    wordId: number | null;
    word: string;
    languageId: number;
};

export type WordResponse = {
    wordId: number;
    word: string;
    languageName?: string;
};

export type Languages = {
    language_id : number;
    language_name : string;
}
