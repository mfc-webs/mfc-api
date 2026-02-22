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

// personal details updates | contact, next of kin | medical conditions

// - - Update personal details updates 

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
         // console.error("PROFILE UPDATE ERROR:", err);     full error
    console.error("CODE:", err.code, "MSG:", err.message); // pg errors have code/message
    return res.status(500).json({ ok: false, message: "Server error updating personal profile" });
  }
}


// - - Update  Emergency/next of kin details 

export const updateEmsDetails = async (req, res) => {
  const client = await db.connect();

  try {
    const userId = req.user?.sub;

    const ecname = req.body?.ecname || null;
    const relationship = req.body?.relationship || null;
    const phone = req.body?.phone || null;
    const priority = req.body?.priority || "primary";
    const ems_notes = req.body?.ems_notes || null;

    await client.query("BEGIN");

    // 1. Remove existing contact of same priority
    await client.query(
      `
      DELETE FROM member_emergency_contacts
      WHERE user_id = $1 AND priority = $2
      `,
      [userId, priority]
    );

    // 2. Check if phone already exists for this user
    const { rows: existing } = await client.query(
      `SELECT id FROM member_emergency_contacts WHERE user_id = $1 AND phone = $2`,
      [userId, phone]
    );
    if (existing.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ ok: false, message: "This phone number is already used." });
    }

    // 3. Insert new contact
    await client.query(
      `
      INSERT INTO member_emergency_contacts
      (user_id, ecname, relationship, phone, priority, ems_notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `,
      [userId, ecname, relationship, phone, priority, ems_notes]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      ok: true,
      message: "Emergency details updated"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error updating emergency details"
    });
  } finally {
    client.release();
  }
};

// - - get EMS to table

export const getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user?.sub;

    const { rows } = await db.query(
      `
      SELECT id, ecname, relationship, phone, priority, ems_notes
      FROM member_emergency_contacts
      WHERE user_id = $1
      ORDER BY priority DESC
      `,
      [userId]
    );

    return res.status(200).json({
      ok: true,
      contacts: rows
    });

  } catch (err) {
    console.error("FETCH EMS ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error. Failed to fetch emergency contacts."
    });
  }
};

// - - delete EMS contact

export const deleteEmergencyContact = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const contactId = req.params.id;

    await db.query(
      `
      DELETE FROM member_emergency_contacts
      WHERE id = $1 AND user_id = $2
      `,
      [contactId, userId]
    );

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ ok: false });
  }
};

//// - - update medical conditions - - ////

export const updateHealthRecord = async (req, res) => {
  const client = await db.connect();

  try {
    const userId = req.user?.sub;

    const medical_conditions = req.body?.medicalConditions || null;
    const injuries = req.body?.injuries || null;
    const health_notes = req.body?.healthNotes || null;
    const consent_share_trainer = req.body?.consentShareTrainer === true;

    await client.query("BEGIN");

    // Check if record exists
    const { rows } = await client.query(
      `SELECT id FROM member_health_records WHERE user_id = $1`,
      [userId]
    );

    if (rows.length > 0) {
      // Update existing
      await client.query(
        `
        UPDATE member_health_records
        SET medical_conditions = $1,
            injuries = $2,
            health_notes = $3,
            consent_share_trainer = $4,
            updated_at = NOW()
        WHERE user_id = $5
        `,
        [medical_conditions, injuries, health_notes, consent_share_trainer, userId]
      );
    } else {
      // Insert new
      await client.query(
        `
        INSERT INTO member_health_records
        (user_id, medical_conditions, injuries, health_notes, consent_share_trainer)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id)
        DO UPDATE SET
          medical_conditions = EXCLUDED.medical_conditions,
          injuries = EXCLUDED.injuries,
          health_notes = EXCLUDED.health_notes,
          consent_share_trainer = EXCLUDED.consent_share_trainer,
          updated_at = CURRENT_TIMESTAMP
        `,
        [userId, medical_conditions, injuries, health_notes, consent_share_trainer]
      );
    }

    await client.query("COMMIT");

    return res.status(200).json({
      ok: true,
      message: "Medical condition saved successfully!"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Health record error:", err);

    return res.status(500).json({
      ok: false,
      message: "Server error. Failed to save medical condition."
    });
  } finally {
    client.release();
  }
};
