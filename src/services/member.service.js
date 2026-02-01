import { db } from "../config/db.js";

export async function getMemberWithProfile(userId) {
  const { rows } = await db.query(
     `
    SELECT
      u.id, u.firstname, u.lastname, u.email, u.phone, u.tier, u.joindate, u.role,
      mp.profile_picture, mp.display_name, mp.bio,
      mp.mail_note, mp.sms_note, mp.wa_note
    FROM public.users u
    LEFT JOIN public.member_profile mp ON mp.user_id = u.id
    WHERE u.id = $1
    LIMIT 1
    `,
    [userId]
  );

  return rows[0];
}
