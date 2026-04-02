import { db } from "../../config/db.js";



export const viewMemberReports = async (req, res, next) => {
  try {
    const gymId = req.gymId;
    const userId = req.user.sub; // because I used { sub: user.id } in JWT

    const { rows } = await db.query(
      `SELECT id, firstname, lastname, email, phone, tier, joindate, role, gym_id
       FROM public.users
       WHERE id = $1
       AND gym_id = $2
       LIMIT 1`,
      [userId, gymId]
    );

    const member = rows[0];
    if (!member) return res.redirect("/login");

  return res.render("dashboard/member-reports", {
    member,
    activePage: "reports",
  });
  } catch (err) {
    console.error("PORTAL ERROR:", err);
    return res.status(500).send("Server error");
  }

};