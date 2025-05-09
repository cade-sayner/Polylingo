import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "kakkakkak",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  // ssl: { rejectUnauthorized: false },
});

export async function connectAndQuery(queryString: string, values: any[]) {
  const res = await pool.query(queryString, values);
  return res;
}

