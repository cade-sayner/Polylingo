import camelcaseKeys from "camelcase-keys";
import { Pool } from "pg";
import 'dotenv/config'

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl: { rejectUnauthorized: false },
});

export async function connectAndQuery(queryString: string, values: any[]) {
  const res = await pool.query(queryString, values);
  return res;
}

export async function queryReturnOne(queryString: string, values: any[]) {
  let rows = (await connectAndQuery(queryString, values)).rows.map((row => camelcaseKeys(row)));
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
}

export async function queryReturnAll(queryString:string, values:any[]){
  let rows = (await connectAndQuery(queryString, values)).rows.map((row => camelcaseKeys(row)));
  return rows;
}

