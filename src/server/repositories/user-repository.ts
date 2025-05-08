import { BaseRepository } from "../lib/base-repository";
import { User } from "../lib/types";

export class UserRepository extends BaseRepository<User> {
    async Exists(googleId : string){
        let queryString = `SELECT * FROM users WHERE google_id = $1`
        return await this.queryReturnOne(queryString, [googleId]);
    }
}