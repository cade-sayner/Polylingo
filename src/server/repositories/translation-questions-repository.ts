import { BaseRepository } from "../lib/base-repository";
import { connectAndQuery } from "../lib/db";
import { TranslationQuestion } from "../lib/types";

export class TranslationQuestionRepository extends BaseRepository<TranslationQuestion> {
    async getQuestionForUser(googleId : string, language : number, difficulty : number|undefined){

        const queryParams: any[] = [];

        let queryString = `
        SELECT * FROM translation_questions t 
        INNER JOIN words w on t.prompt_word = w.word_id
        INNER JOIN languages l on w.language_id = l.language_id 
        WHERE l.language_id = $1
        AND t.translation_question_id NOT IN (
            SELECT translation_question_id FROM translation_questions_audit 
            WHERE user_id = $2}
        )`;

        queryParams.push(language);
        queryParams.push(googleId);
        
                
        if (difficulty !== undefined) {
            queryString += ` AND difficulty_score = $3}`;
            queryParams.push(difficulty);
        }

        return await this.queryReturnOne(queryString, queryParams);
    }

}