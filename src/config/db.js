import pg from "pg";
const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
   user: "postgres",
  database: "mms",
  password: process.env.DB_PASSWORD,
  port: 5432,
});


// export const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "mms",
//     password: process.env.DB_PASSWORD,
//     port: 5432,
// })

export async function connectDB() {
  await db.connect();
  console.log("✅ Connected to PostgreSQL");
}