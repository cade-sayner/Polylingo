import { BaseRepository } from "../lib/base-repository";
import { FillBlankQuestion, FillBlankQuestionResponse, Language, LanguageModel } from "../lib/types";
import { queryReturnAll } from "../lib/db";
import { queryReturnOne } from "../lib/db";

export class FillBlankRepository extends BaseRepository<FillBlankQuestion> {
   async getFillBlankByLanguage(language: Language): Promise<FillBlankQuestionResponse | null> {
      let languageObject = await queryReturnOne("SELECT * FROM languages WHERE language_name = $1", [language]) as LanguageModel;
      let questions = await queryReturnAll("SELECT * FROM fill_blank_questions as FBQ inner join words as W on FBQ.missing_word_id = W.word_id where W.language_id = $1", [languageObject.languageId]) as FillBlankQuestionResponse[];
      if (questions.length === 0) return null;
      let chosenQuestion = questions[Math.floor(Math.random() * questions.length)];
      return {
         placeholderSentence: chosenQuestion.placeholderSentence,
         difficultyScore: chosenQuestion.difficultyScore,
         distractors: chosenQuestion.distractors,
         fillBlankQuestionId: chosenQuestion.fillBlankQuestionId,
         word: chosenQuestion.word
      }
   }

   async Exists(question : FillBlankQuestion){
      const queryString = `
      SELECT * 
      FROM fill_blank_questions 
      WHERE placeholder_sentence = $1
      AND missing_word_id = $2
      AND distractors = $3
      `
      if(await queryReturnOne(queryString, [question.placeholderSentence, question.missingWordId, question.distractors])){
         return true;
      }
      return false;
   }

   async getEasiestUnanswered(language: Language, googleId: number) {
      const languageObject = await queryReturnOne("SELECT * FROM languages WHERE language_name = $1", [language]) as LanguageModel;
      const  queryString = `
        SELECT * FROM fill_blank_questions t 
        INNER JOIN words w on t.missing_word_id = w.word_id
        INNER JOIN languages l on w.language_id = l.language_id 
        WHERE l.language_id = $1
        AND t.fill_blank_questions_id NOT IN (
            SELECT fill_blank_question_id FROM fill_blank_questions_audit 
            WHERE user_id = $2
        ) 
         ORDER BY t.difficulty_score
         LIMIT 1
      `;
      const chosenQuestion = await queryReturnOne(queryString, [languageObject.languageId, googleId]) as FillBlankQuestionResponse | null
      return (chosenQuestion == null) ? null
       :  {
            placeholderSentence: chosenQuestion.placeholderSentence,
            difficultyScore: chosenQuestion.difficultyScore,
            distractors: chosenQuestion.distractors,
            fillBlankQuestionId: chosenQuestion.fillBlankQuestionId,
            word: chosenQuestion.word
         }
      }
}