import { BaseRepository } from "../lib/base-repository";
import { TranslationQuestion } from "../lib/types";

export class TranslationQuestionRepository extends BaseRepository<TranslationQuestion> {
    // async Exists(googleId : string){
    //     let queryString = `SELECT * FROM users WHERE google_id = $1`
    //     if(await this.queryReturnOne(queryString, [googleId])) return true;
    //     return false
    // }

}