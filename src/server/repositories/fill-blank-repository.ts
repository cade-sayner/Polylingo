import { BaseRepository } from "../lib/base-repository";
import { FillBlankQuestion, FillBlankQuestionResponse, Language, LanguageModel } from "../lib/types";

export class FillBlankRepository extends BaseRepository<FillBlankQuestion>{
     async getFillBlankByLanguage(language : Language) : Promise<FillBlankQuestionResponse | null>{
        let languageObject = await this.queryReturnOne("SELECT * FROM languages WHERE language_name = $1", [language]) as LanguageModel;
        console.log(languageObject);
        let questions = await this.queryReturnAll("SELECT * FROM fill_blank_questions as FBQ inner join words as W on FBQ.missing_word_id = W.word_id where W.language_id = $1", [languageObject.languageId]) as FillBlankQuestionResponse[] ;
        if(questions.length === 0) return null;
      
        let chosenQuestion = questions[Math.floor(Math.random() * questions.length)];
        console.log(chosenQuestion);
        return {
           placeholderSentence : chosenQuestion.placeholderSentence,
           difficultyScore : chosenQuestion.difficultyScore,
           distractors : chosenQuestion.distractors,
           fillBlankQuestionId : chosenQuestion.fillBlankQuestionId,
           word : chosenQuestion.word
        }
     }
}