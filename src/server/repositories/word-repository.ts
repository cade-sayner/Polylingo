import { BaseRepository } from "../lib/base-repository";
import { queryReturnAll } from "../lib/db";
import { Word } from "../lib/types";

export class WordRepository extends BaseRepository<Word> {
    async searchWord(languageId: number, searchText: string){
        let queryString = `
        SELECT * FROM words
        WHERE language_id = $1
        AND word LIKE $2
        ORDER BY LENGTH(word)
        LIMIT 50
        `;

        const translationQuestions = await queryReturnAll(queryString, [languageId, searchText+'%']) as unknown as Word | null; 

        return translationQuestions;
    }
}