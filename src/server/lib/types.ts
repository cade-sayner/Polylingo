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

export type TranslationQuestion = {
    translationQuestionId : number | null;
    promptWord : number;
    answerWord : number;
    distractors : string[];
    difficultyScore : number;
}

export type TranslationQuestionResponse = {
    translationQuestionId : number | null;
    promptWord : string;
    answerWord : string;
    distractors : string[];
    difficultyScore : number;
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

export type Word = {
    wordId : number | null;
    word : string;
    languagId : number;
}

export type FillBlankQuestionResponse = {
    fillBlankQuestionId : number;
    placeholderSentence : string;
    word : string;
    distractors : string[];
    difficultyScore : number;
}

export type PrimitiveTypes = "string" | "number" | "boolean" | "symbol" | "undefined" | "bigint" | "object" | "function";


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
