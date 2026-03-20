import { db } from "../config/db.js";

export async function getMemberWithProfile(userId) {
  const { rows } = await db.query(
     `
    SELECT
      u.id, u.firstname, u.lastname, u.email, u.phone, u.tier, u.joindate, u.role, u.status,

      -- member edit profile columns

          mp.profile_picture, 
          mp.display_name, 
          mp.bio, 
          mp.mail_note, 
          mp.sms_note, 
          mp.wa_note, 
          mp.updated_at AS mp_updated_at,

      -- member personal details columns

          mcd.whatsapp_number, 
          mcd.alt_phone, 
          mcd.street_address, 
          mcd.city, 
          mcd.province, 
          mcd.postal_code, 
          mcd.notes,
          mcd.birthdate AS "birthdate",
          mcd.gender,
          
      -- member emergency contact details

          mec.ecname, 
          mec.relationship, 
          mec.phone, 
          mec.priority, 
          mec.ems_notes, 
          mec.updated_at AS ems_updated_at, 

      -- member health records 

          mhr.medical_conditions, 
          mhr.injuries, mhr.health_notes, 
          mhr.consent_share_trainer, 
          mhr.medication, 
          mhr.updated_at AS health_updated_at


    FROM public.users u
    
    LEFT JOIN public.member_profile mp
      ON mp.user_id = u.id

    LEFT JOIN public.member_contact_details mcd
      ON mcd.user_id = u.id

    LEFT JOIN public.member_emergency_contacts mec
      ON mec.user_id = u.id 

    LEFT JOIN public.member_health_records mhr
      ON mhr.user_id = u.id 
      
    WHERE u.id = $1
    LIMIT 1
    `,
    [userId]
  );

  return rows[0];
}


// search member for kiosk check-in service

export const searchMembers = async (query) => {
  const result = await db.query(
    `
    SELECT 
      u.id,
      u.firstname,
      u.lastname,
      mp.display_name,
      mp.profile_picture
    FROM users u
    LEFT JOIN member_profile mp 
      ON mp.user_id = u.id
    WHERE 
      u.firstname ILIKE $1
      OR u.lastname ILIKE $1
      OR (u.firstname || ' ' || u.lastname) ILIKE $1
      OR mp.display_name ILIKE $1
    ORDER BY u.firstname ASC
    LIMIT 6
    `,
    [`%${query}%`]
  );

  return result.rows;
};