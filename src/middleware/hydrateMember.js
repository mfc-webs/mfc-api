import { db } from "../config/db.js";
import { getMemberWithProfile } from "../services/member.service.js";

export const hydrateMember = async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.redirect("/login");

    const member = await getMemberWithProfile(userId);
    if (!member) return res.redirect("/login");

    res.locals.member = member;
    return next();
  } catch (err) {
    console.error("HYDRATE MEMBER ERROR:", err);
    return res.redirect("/login");
  }
};