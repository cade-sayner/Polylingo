import { Pool } from "pg";


// obviously this is to be read from env
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'galactic_db',
  password: 'kakkakkak',
  port: 5432,
});

export async function connectAndQuery(queryString: string, values: any[]) {
  const res = await pool.query(queryString, values);
  return res;
}

