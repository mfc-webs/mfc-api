import { getMemberWithProfile } from "../services/member.service.js";
import * as dietaryService from "../services/memberDietary.service.js";

export const hydrateMember = async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.redirect("/login");

    const member = await getMemberWithProfile(userId);

    const dietary = await dietaryService.getDietaryInfo(req.user.sub);

    member.dietary = dietary; // ✅ attach dietary info


    if (!member) return res.redirect("/login");

    res.locals.member = member;
    return next();
  } catch (err) {
    console.error("HYDRATE MEMBER ERROR:", err);
    return res.redirect("/login");
  }
};