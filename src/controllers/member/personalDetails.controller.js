import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { db } from "../../config/db.js";


const __dirname = dirname(fileURLToPath(import.meta.url));

export const viewMemberPersonalDetails = async (req, res, next) => {
    return res.render("dashboard/member-personal-details", {
    activePage: "personal-details",
  });
};

// personal details updates | contact, next of kin, medical conditions

export const updatepersonalDetails = async (req, res,) => {
  try {

    const userId = req.user?.sub;

    const whatsapp_number = req.body?.whatsapp_number || null;
    const alt_phone = req.body?.alt_phone || null;
    const street_address = req.body?.street_address || null;
    const city = req.body?.city || null;
    const province = req.body?.province || null;
    const postal_code = req.body?.postal_code || null;
    const notes = req.body?.notes || null;


  await db.query(
    `
    INSERT INTO public.member_contact_details (user_id, whatsapp_number, alt_phone, street_address, city, province, postal_code, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id)
    DO UPDATE SET
    whatsapp_number = EXCLUDED.whatsapp_number, 
    alt_phone = EXCLUDED.alt_phone, 
    street_address = EXCLUDED.street_address, 
    city = EXCLUDED.city, 
    province = EXCLUDED.province, 
    postal_code = EXCLUDED.postal_code, 
    notes = EXCLUDED.notes,
    updated_at = NOW()
    `,
    [userId, whatsapp_number, alt_phone, street_address, city, province, postal_code, notes]
  );
    return res.status(200).json({ ok: true, message: "Personal details updated" });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);          // full error
    console.error("CODE:", err.code, "MSG:", err.message); // pg errors have code/message
    return res.status(500).send("Server error updating profile");
  }
}


// - - - Emergency/next of kin details 

export const updateEmsDetails = async (req, res,) => {
  try {

    const userId = req.user?.sub;

    const ecname = req.body?.ecname || null;
    const relationship = req.body?.relationship || null;
    const phone = req.body?.phone || null;
    const priority = req.body?.priority || null;
    const ems_notes = req.body?.ems_notes || null;

  await db.query(
    `
    INSERT INTO public.member_emergency_contacts (user_id, ecname, relationship, phone, priority, ems_notes)
    VALUES ($1, $2, $3, $4, $5, $6 )
    ON CONFLICT (user_id)
    DO UPDATE SET
    ecname = EXCLUDED.ecname, 
    relationship = EXCLUDED.relationship, 
    phone = EXCLUDED.phone, 
    priority = EXCLUDED.priority, 
    ems_notes = EXCLUDED.ems_notes, 
    created_at = NOW()
    `,
    [userId, ecname, relationship, phone, priority, ems_notes]
  );
  console.log("REQ BODY:", req.body);
  console.log("EMS NOTES VALUE:", ems_notes);
    return res.status(200).json({ ok: true, message: "Personal details updated" });
  } catch (err) {
    //console.error("PROFILE UPDATE ERROR:", err); full error
    console.error("CODE:", err.code, "MSG:", err.message); // pg errors have code/message
    return res.status(500).send("Server error updating profile");
  }
}