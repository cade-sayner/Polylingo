import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "polylingo_db",
  password: process.env.DB_PASSWORD || "kakkakkak",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

export async function connectAndQuery(queryString: string, values: any[]) {
  const res = await pool.query(queryString, values);
  return res;
}

