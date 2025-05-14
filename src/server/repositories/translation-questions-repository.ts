import { BaseRepository } from "../lib/base-repository";
import { queryReturnAll, queryReturnOne } from "../lib/db";
import { TranslationQuestion, TranslationQuestionResponse, Word } from "../lib/types";

export class TranslationQuestionRepository extends BaseRepository<TranslationQuestion> {

    async getTranslationQuestionByLanguage(promptLanguage : string, answerLanguage : string): Promise<TranslationQuestionResponse | null> {
        let queryString = `
        SELECT * FROM translation_questions t 
        where prompt_word in (select word_id from words as w inner join languages as l on l.language_id = w.language_id where language_name = $1)
        AND answer_word in (select word_id from words as w inner join languages as l on l.language_id = w.language_id where language_name = $2)
      `;
        const translationQuestions = await queryReturnAll(queryString, [promptLanguage, answerLanguage]) as TranslationQuestion[];
        
        if(translationQuestions.length == 0) return null;
        const chosenQuestion = translationQuestions[Math.floor(Math.random() * translationQuestions.length)];
        let promptWord = await queryReturnOne("SELECT * FROM words WHERE word_id = $1", [chosenQuestion?.promptWord]) as Word;
        let answerWord = await queryReturnOne("SELECT * FROM words WHERE word_id = $1", [chosenQuestion?.answerWord]) as Word;
        let value  = {
            difficultyScore: chosenQuestion!.difficultyScore,
            distractors: chosenQuestion!.distractors,
            translationQuestionId: chosenQuestion!.translationQuestionId,
            promptWord: promptWord.word,
            answerWord: answerWord.word,
        }
        return value;
    }

    async Exists(question : TranslationQuestion){
      const queryString = `
      SELECT * 
      FROM translation_questions 
      WHERE prompt_word = $1
      AND answer_word = $2
      AND distractors = $3
      `
      if(await queryReturnOne(queryString, [question.promptWord, question.answerWord, question.distractors])){
         return true;
      }
      return false;
    }

    async getEasiestUnanswered(promptLanguage: string, answerLanguage: string, userId: string): Promise<TranslationQuestionResponse | null> {
        let queryString = `
        SELECT * FROM translation_questions t 
        where prompt_word in (select word_id from words as w inner join languages as l on l.language_id = w.language_id where language_name = $1)
        AND answer_word in (select word_id from words as w inner join languages as l on l.language_id = w.language_id where language_name = $2)
		AND t.translation_question_id NOT IN (
            SELECT translation_question_id FROM translation_questions_audit tqi
            INNER JOIN users u ON u.user_id = tqi.user_id
            WHERE u.google_id = $3
        ) 
        ORDER BY t.difficulty_score
        LIMIT 1
        `;

        const translationQuestion = await queryReturnOne(queryString, [promptLanguage, answerLanguage, userId]) as TranslationQuestion | null;
        let promptWord = await queryReturnOne("SELECT * FROM words WHERE word_id = $1", [translationQuestion?.promptWord]) as {word : string};
        let answerWord = await queryReturnOne("SELECT * FROM words WHERE word_id = $1", [translationQuestion?.answerWord]) as {word : string};
        if(!translationQuestion) return null;
        return {
            difficultyScore: translationQuestion!.difficultyScore,
            distractors: translationQuestion!.distractors,
            translationQuestionId: translationQuestion!.translationQuestionId,
            promptWord: promptWord.word,
            answerWord: answerWord.word,
        }
    }

    async getByLanguageAndDifficulty(promptLanguage: string, answerLanguage : string, userId : string, difficultyScore : number){
        let queryString = `
        SELECT * FROM translation_questions t 
        where prompt_word in (select word_id from words as w inner join languages as l on l.language_id = w.language_id where language_name = $1)
        AND answer_word in (select word_id from words as w inner join languages as l on l.language_id = w.language_id where language_name = $2)
		AND t.translation_question_id NOT IN (
            SELECT translation_question_id FROM translation_questions_audit  tqi
            INNER JOIN users u ON u.user_id = tqi.user_id
            WHERE u.google_id = $3
        ) 
        AND t.difficulty_score = $4
        LIMIT 1
        `;
        const translationQuestion = await queryReturnOne(queryString, [promptLanguage, answerLanguage, userId, difficultyScore]) as TranslationQuestion | null;
        let promptWord = await queryReturnOne("SELECT * FROM words WHERE word_id = $1", [translationQuestion?.promptWord]) as {word : string};
        let answerWord = await queryReturnOne("SELECT * FROM words WHERE word_id = $1", [translationQuestion?.answerWord]) as {word : string};

        if(!translationQuestion) return null 

        return {
            difficultyScore: translationQuestion!.difficultyScore,
            distractors: translationQuestion!.distractors,
            translationQuestionId: translationQuestion!.translationQuestionId,
            promptWord: promptWord.word,
            answerWord: answerWord.word,
        } 
    }

    async getByPromptWordId(promptWordId: number){
        let queryString = `
        SELECT * FROM translation_questions
        WHERE prompt_word = $1
        `;

        const translationQuestions = await queryReturnAll(queryString, [promptWordId]) as unknown as TranslationQuestion | null; 

        return translationQuestions;
    }
}