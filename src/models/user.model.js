import { db } from "../config/db.js";

export const User = {

  async findOne(email, gymId) {
    const result = await db.query(
      `SELECT * FROM public.users
      WHERE email = $1 
      AND gym_id = $2
      LIMIT 1`,
      [email, gymId]
    );

    return result.rows[0];
  },

  async create({ firstname, lastname, phone, email, password, role, gymId }) {
    const result = await db.query(
      `INSERT INTO public.users 
      (firstname, lastname, phone, email, password, role, gym_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [firstname, lastname, phone, email, password, role, gymId]
    );

    return result.rows[0];
  }

};