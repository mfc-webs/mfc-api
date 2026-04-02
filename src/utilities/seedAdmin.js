import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const seedAdmin = async () => {
  try {

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const gymId = process.env.ADMIN_GYM_ID;

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
      gymId

    });

    console.log("Admin created successfully.");
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};