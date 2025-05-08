import { BaseRepository } from "../lib/base-repository";
import { Word } from "../lib/types";

export class WordRepository extends BaseRepository<Word> {
    constructor() {
        super('words', 'word_id');
    }
}