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

export type Word = {
    wordId : number | null;
    word : string;
    languagId : number;
}