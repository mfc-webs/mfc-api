import { db } from "../config/db.js";

export const User = {

  async findOne(email) {
    const result = await db.query(
      `SELECT * FROM public.users WHERE email = $1 LIMIT 1`,
      [email]
    );

    return result.rows[0];
  },

  async create({ firstname, lastname, phone, email, password, role }) {
    const result = await db.query(
      `INSERT INTO public.users 
      (firstname, lastname, phone, email, password, role)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [firstname, lastname, phone, email, password, role]
    );

    return result.rows[0];
  }

};