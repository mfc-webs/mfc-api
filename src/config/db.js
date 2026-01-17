import pg from "pg";

export const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "mms",
    password: process.env.DB_PASSWORD,
    port: 5432,
})

export async function connectDB() {
  await db.connect();
  console.log("✅ Connected to PostgreSQL");
}