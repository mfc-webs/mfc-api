import { db } from "../config/db.js";

export const hydrateMember = async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.redirect("/login");

    const { rows } = await db.query(
      `SELECT id, firstname, lastname, email, phone, tier, joindate, role
       FROM public.users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );

    const member = rows[0];
    if (!member) return res.redirect("/login");

    // available in controllers
    req.member = member;

    // available in ALL EJS views automatically (no need to pass { member } every time)
    res.locals.member = member;
    res.locals.isAdmin = member.role === "admin";

    return next();
  } catch (err) {
    console.error("LOAD MEMBER ERROR:", err);
    return res.status(500).send("Server error");
  }
};
