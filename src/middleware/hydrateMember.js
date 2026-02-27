import { getMemberWithProfile } from "../services/member.service.js";
import * as dietaryService from "../services/memberDietary.service.js";
import * as physiqueService  from '../services/physiqueLifestyleService.js';

export const hydrateMember = async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.redirect("/login");

    const member = await getMemberWithProfile(userId);
    const dietary = await dietaryService.getDietaryInfo(req.user.sub);
    const physique = await physiqueService.getByMemberphysiqueInfo(req.user.sub);

    member.dietary = dietary; // ✅ attach dietary info
    member.physique = physique; // ✅ attach physique info



    if (!member) return res.redirect("/login");

    res.locals.member = member;
    return next();
  } catch (err) {
    console.error("HYDRATE MEMBER ERROR:", err);
    return res.redirect("/login");
  }
};