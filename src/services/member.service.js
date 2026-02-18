import { db } from "../config/db.js";

export async function getMemberWithProfile(userId) {
  const { rows } = await db.query(
     `
    SELECT
      u.id, u.firstname, u.lastname, u.email, u.phone, u.tier, u.joindate, u.role,

      -- member edit profile columns

      mp.profile_picture, mp.display_name, mp.bio, mp.mail_note, mp.sms_note, mp.wa_note,

      -- member personal details columns

       mcd.whatsapp_number, mcd.alt_phone, mcd.street_address, mcd.city, mcd.province, mcd.postal_code, mcd.notes,

      -- member emergency contact details

       mec.ecname, mec.relationship, mec.phone, mec.priority, ems_notes 


    FROM public.users u
    
    LEFT JOIN public.member_profile mp
      ON mp.user_id = u.id

    LEFT JOIN public.member_contact_details mcd
      ON mcd.user_id = u.id

    LEFT JOIN public.member_emergency_contacts mec
      ON mec.user_id = u.id
      
    WHERE u.id = $1
    LIMIT 1
    `,
    [userId]
  );

  return rows[0];
}
