import { db } from "../../config/db.js";
import bcrypt from "bcrypt";


export const viewAllMembers = async (req, res, next) => {
   return res.render("admin/admin-dashboard.html", { 
      activePage: "members"
   });
};


export const viewMemberDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const { rows } = await db.query(`
      SELECT 
        u.id,
        u.firstname,
        u.lastname,
        u.email,
        u.phone AS user_phone,
        u.tier,
        to_char(u.joindate, 'DD/MM/YYYY') AS joindate,
        u.status,

        cd.gender,
        to_char(cd.birthdate, 'DD/MM/YYYY') AS birthdate,
        cd.street_address,
        cd.notes,
        cd.city,
        cd.province,
        cd.postal_code,

        ec.ecname,
        ec.relationship,
        ec.phone AS emergency_phone,
        ec.ems_notes,
        
        hr.medical_conditions,
        hr.injuries,
        hr.medication,
        hr.health_notes,
        
        a.total_visits,
        a.visits_this_month,
        COALESCE(TO_CHAR(a.last_visit, 'DD Mon YYYY, HH24:MI'), 'Never') AS last_visit

      FROM public.users u
      LEFT JOIN public.member_contact_details cd 
        ON cd.user_id = u.id
      LEFT JOIN public.member_emergency_contacts ec 
        ON ec.user_id = u.id
      LEFT JOIN public.member_health_records hr
        ON hr.user_id = u.id
      LEFT JOIN LATERAL (
          SELECT 
            COUNT(*) AS total_visits,
            COUNT(*) FILTER (
              WHERE date_trunc('month', check_in_time) = date_trunc('month', NOW())
            ) AS visits_this_month,
            MAX(check_in_time) AS last_visit
          FROM public.attendance
          WHERE user_id = u.id
        ) a ON true

      WHERE u.id = $1
      LIMIT 1
    `, [userId]);


    const member = rows[0];

    if (!member) {
      return res.status(404).send("Member not found");
    }

    res.render("admin/admin-member-details", {
      activePage: "members",
      member
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};





// - - - quick member actions - - -//


export const getMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const tier = req.query.tier || "";

    const offset = (page - 1) * limit;


    const [dataResult, countResult, statsResult] = await Promise.all([
  db.query(`
    SELECT id, firstname, lastname, email, phone, tier,
    to_char(joindate, 'YYYY-MM-DD') AS joindate
    FROM users
    WHERE 
      ($1 = '' OR 
        LOWER(firstname || ' ' || lastname || ' ' || email || ' ' || phone)
        LIKE LOWER('%' || $1 || '%'))
      AND
      ($2 = '' OR tier = $2)
    ORDER BY id ASC
    LIMIT $3 OFFSET $4
  `, [search, tier, limit, offset]),

  db.query(`
    SELECT COUNT(*) 
    FROM users
    WHERE 
      ($1 = '' OR 
        LOWER(firstname || ' ' || lastname || ' ' || email || ' ' || phone)
        LIKE LOWER('%' || $1 || '%'))
      AND
      ($2 = '' OR tier = $2)
  `, [search, tier]),

  db.query(`
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE tier = 'Gold') AS gold,
      COUNT(*) FILTER (WHERE tier = 'Platinum') AS platinum,
      COUNT(*) FILTER (WHERE tier = 'Bronze') AS bronze
    FROM users
    WHERE 
      ($1 = '' OR 
        LOWER(firstname || ' ' || lastname || ' ' || email || ' ' || phone)
        LIKE LOWER('%' || $1 || '%'))
      AND
      ($2 = '' OR tier = $2)
  `, [search, tier])
]);

    const total = parseInt(countResult.rows[0].count);
    const stats = statsResult.rows[0];

    return res.json({
      members: dataResult.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        total: parseInt(stats.total),
        gold: parseInt(stats.gold),
        platinum: parseInt(stats.platinum),
        bronze: parseInt(stats.bronze)
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load members" });
  }
};


export const createMember = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, tier, joindate,
            gender, birthdate, notes,
            ecname, relationship, ephone

     } = req.body;

    if (!firstname || !lastname || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const allowed = ["Bronze", "Gold", "Platinum"];
    const safeTier = allowed.includes(tier) ? tier : "Bronze";
    const password = 'Password123';

    const hashedPassword = await bcrypt.hash(password, 10);


     await db.query("BEGIN");

    const result = await db.query(
      `INSERT INTO public.users 
      (firstname, lastname, email, phone, password, tier, joindate)
       VALUES 
       ($1, $2, $3, $4, $5, $6, COALESCE($7::date, CURRENT_DATE))
       RETURNING id, firstname, lastname, email, phone, password, tier, 
        to_char(joindate, 'YYYY-MM-DD') AS joindate
        `,
      [firstname, lastname, email.trim().toLowerCase(), phone, hashedPassword, safeTier, joindate]
      );

      const userId = result.rows[0].id;

       // Insert contact details
        await db.query(
          `INSERT INTO public.member_contact_details
          (user_id, gender, birthdate, notes)
          VALUES ($1,$2,$3,$4)`,
          [userId, gender, birthdate, notes]
        );

        // Insert emergency contact
        await db.query(
          `INSERT INTO public.member_emergency_contacts
          (user_id, ecname, relationship, phone)
          VALUES ($1,$2,$3,$4)`,
          [userId, ecname, relationship, ephone]
        );

         await db.query("COMMIT");

        return res.status(201).json({
          ok: true,
          message: "New member created successfully",
          data: result.rows[0]
        });
    
  }catch (err) {
  console.error("CREATE MEMBER ERROR:", err.code, err.message);
  return res.status(500).json({ message: err.message });
}

};


export const deleteMember = async (req, res) => {
  try {

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      console.log("BAD ID (not a number):", req.params.id);
      return res.status(400).json({ message: "Invalid member id" });
    }

    const result = await db.query(
      "DELETE FROM public.users WHERE id = $1 RETURNING id",
      [id]
    );

    console.log("DELETE rowCount:", result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.json({ message: "Deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateMemberTier = async (req, res) => {
  try {
    const { id } = req.params;
    const { tier } = req.body;

    const allowed = ["Bronze", "Gold", "Platinum"];
    if (!allowed.includes(tier)) {
      return res.status(400).json({ message: "Invalid tier" });
    }

    const result = await db.query(
      `UPDATE public.users SET tier = $1 WHERE id = $2 RETURNING id, tier`,
      [tier, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json({ message: "Tier updated", member: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update tier" });
  }
};
