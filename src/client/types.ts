// Types
//--------------------------------------------------------------------------------------------------------------------------------
export type User = {
    userId: number | null;
    googleId: string;
    email: string;
    name: string;
    roleId: number;
  };
  
export type Role = {
    id: number | null;
    role: "USER" | "INSTRUCTOR";
  }
  
export type Language = "Afrikaans" | "Spanish" | "Italian" | "German" | "French"
  
export type FillBlankQuestion = {
    fillBlankQuestionsId : number;
    placeholderSentence : string;
    word : string;
    distractors : string[];
    difficultyScore : number;
    completed : boolean;
}

export type TranslationQuestion = {
    translationQuestionId : number;
    promptWord : string;
    answerWord : string;
    distractors : string[];
    difficultyScore : number;
    completed : boolean;
}
  
export interface RouteDefinition {
    content: () => string | undefined;
    loadCallback: () => void;
}