import { connectAndQuery } from "./db";
import camelcaseKeys from 'camelcase-keys';

export class BaseRepository<T extends Object>{
    tableName : string;
    primaryKeyColumnName : string;

    constructor(tableName : string, primaryKeyColumnName : string){
        this.tableName = tableName;
        this.primaryKeyColumnName = primaryKeyColumnName;
    }

    // creates an entry of type T in the db, assuming the first column of the model is the primary key
    async create(model : T){
        // remove all keys whose corresponding values are null, as these should be excluded from the insertion
        const filteredModel = Object.fromEntries(
            Object.entries(model).filter(([key, value]) => value !== null)
        );
        let [keys, values] = [Object.keys(filteredModel), Object.values(filteredModel)];
        let queryString = `
        INSERT INTO 
        ${this.tableName} (${keys.map(val=>BaseRepository.camelToSnakeCase(val))
            .join(",")}) 
        VALUES 
        (${Array.from({ length: keys.length}, (_, i) => `$${i + 1}`).join(",")})
        RETURNING *`
        let rows = (await connectAndQuery(queryString, values)).rows.map((row =>camelcaseKeys(row)))
        // add validation to ensure this assertion is always viable?
        return rows as T[];
    }

    // assumes integer ids only
    async getByID(id : number) {
        let queryString = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKeyColumnName} = $1`
        return this.queryReturnOne(queryString, [id])
    }

    async deleteByID(id: number){
        let queryString = `DELETE FROM ${this.tableName} WHERE ${this.primaryKeyColumnName} = $1 RETURNING *`
        return this.queryReturnOne(queryString, [id])
    }

    async queryReturnOne(queryString:string, values:any[]){
        let rows = (await connectAndQuery(queryString, values)).rows.map((row => camelcaseKeys(row)));
        if(rows.length > 0){
            return rows[0];
        }
        return null;
    }

    async queryReturnAll(queryString:string, values:any[]){
        let rows = (await connectAndQuery(queryString, values)).rows.map((row => camelcaseKeys(row)));
        return rows;
    }

    async getAllByColumnName(columnName : keyof T, value : string | number){
        let queryString = `SELECT * FROM ${this.tableName} WHERE ${BaseRepository.camelToSnakeCase(String(columnName))} = $1`
        return await this.queryReturnAll(queryString, []);
    }

    async getByColumnName(columnName : keyof T, value : string | number){
        let queryString = `SELECT * FROM ${this.tableName} WHERE ${BaseRepository.camelToSnakeCase(String(columnName))} = $1`
        return await this.queryReturnOne(queryString, [value]);
    }

    static camelToSnakeCase(camelString : string){
        return camelString.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    
    async getAll() {
        const rows = (await connectAndQuery(`SELECT * FROM ${this.tableName}`, [])).rows;
        return rows.map(row => camelcaseKeys(row)) as T[];
    }

}
