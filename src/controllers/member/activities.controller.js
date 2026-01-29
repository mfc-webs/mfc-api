import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";


const __dirname = dirname(fileURLToPath(import.meta.url));

export const viewMemberActivities = async (req, res, next) => {

  try {
    const userId = req.user.sub; // because I used { sub: user.id } in JWT

    const { rows } = await db.query(
      `SELECT id, firstname, lastname, email, phone, tier, joindate, role
       FROM public.users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );

    const member = rows[0];
    if (!member) return res.redirect("/login");

   return res.render("dashboard/member-activities", { 
    member,
    activePage: "activities",
  });
  } catch (err) {
    console.error("PORTAL ERROR:", err);
    return res.status(500).send("Server error");
  }
};