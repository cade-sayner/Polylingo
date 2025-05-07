// Types
//--------------------------------------------------------------------------------------------------------------------------------
type User = {
    userId: number | null;
    googleId: string;
    email: string;
    name: string;
    roleId: number;
  };
  
  type Role = {
    id: number | null;
    role: "USER" | "INSTRUCTOR";
  }
  
  type Language = "Afrikaans" | "Spanish" | "Italian" | "German" | "French"
  
  type FillBlankQuestion = {
    fillBlankQuestionId : number;
    placeholderSentence : string;
    missingWord : string;
    distractors : string[];
    difficultyScore : number;
  }
  
  interface RouteDefinition {
    content: () => string | undefined;
    loadCallback: () => void;
  }