import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { db } from "../../config/db.js";


const __dirname = dirname(fileURLToPath(import.meta.url));

export const viewEditProfile = async (req, res, next) =>  { 
    return res.render("dashboard/member-edit-profile" , { 
      activePage: "portal"
   });
};

export const updateMemberProfile = async (req, res) => {
  try {
    const userId = req.user.sub;

    const display_name = req.body.display_name || null;
    const bio = req.body.bio || null;

    // checkboxes (FormData sends "on" or missing)
    const mail_note = req.body.mail_note === "on";
    const sms_note  = req.body.sms_note === "on";
    const wa_note   = req.body.wa_note === "on";

    // if file uploaded, save the public path
    const profile_picture = req.file
      ? `/uploads/profile-pics/${req.file.filename}`
      : null;

    await db.query(
      `
      INSERT INTO public.member_profile (user_id, profile_picture, display_name, bio, mail_note, sms_note, wa_note)
      VALUES ($1, COALESCE($2, '/images/profile-pic.jpg'), $3, $4, $5, $6, $7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        profile_picture = COALESCE($2, public.member_profile.profile_picture),
        display_name = EXCLUDED.display_name,
        bio = EXCLUDED.bio,
        mail_note = EXCLUDED.mail_note,
        sms_note  = EXCLUDED.sms_note,
        wa_note   = EXCLUDED.wa_note,
        updated_at = NOW()
      `,
      [userId, profile_picture, display_name, bio, mail_note, sms_note, wa_note]
    );

    return res.status(200).json({ ok: true, message: "Profile updated" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).send("Could not update profile");
  }
};

