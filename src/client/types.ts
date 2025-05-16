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
    quesword? : string;
    answord? : string;
}

export interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export interface LanguageOption {
  language_id: number;
  language_name: string;
}
  
export interface BasePage extends BaseComponent{
  load : () => void;
}

export interface BaseInstructorPage extends BaseInstructorComponent{
  load : () => void;
}

export interface BaseComponent{
  render : (prop ?: any) => HTMLElement | HTMLElement[];
  mount?(): void;
}

export interface BaseInstructorComponent{
  render : (prop ?: any) => string;
  mount?(): void;
}