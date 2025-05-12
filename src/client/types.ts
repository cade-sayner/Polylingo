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

export interface JwtPayload {
  exp?: number;
  [key: string]: any;
}
  
export interface BasePage extends BaseComponent{
  load : () => void;
}

export interface BaseComponent{
  render : (prop ?: any) => string;
}