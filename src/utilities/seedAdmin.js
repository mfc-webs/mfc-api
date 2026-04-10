import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { db } from "../config/db.js";

export const seedAdmin = async () => {
  try {

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const gymSlug = process.env.ADMIN_GYM_SLUG;

    const gymResult = await db.query(
        "SELECT id FROM gyms WHERE slug = $1",
        [gymSlug]
      );

      if (!gymResult.rows.length) {
        console.log("Gym not found for seeding.");
        return;
      }

      const gymId = gymResult.rows[0].id;

    // 🚨 If env values are removed, skip seeding
    if (!email || !password) {
      console.log("Admin seed skipped (no env credentials)");
      return;
    }


    const existingAdmin = await User.findOne(email, gymId);

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );


    await User.create({
      firstname: "Sir",
      lastname: "Mango",
      phone: "0672845741",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      gym_id: gymId,

    });

    console.log("Admin created successfully.");
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};