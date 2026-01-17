import { db } from "../config/db.js";

export const getMembers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, firstname, lastname, email, phone, tier, joindate
      FROM public.users
      ORDER BY id ASC
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load members" });
  }
};

export const createMember = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, tier } = req.body;

    if (!firstname || !lastname || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const allowed = ["Bronze", "Gold", "Platinum"];
    const safeTier = allowed.includes(tier) ? tier : "Bronze";

    const result = await db.query(
      `INSERT INTO public.users (firstname, lastname, email, phone, tier)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, firstname, lastname, email, phone, tier, joindate`,
      [firstname, lastname, email, phone, safeTier]
    );

    return res.status(201).json(result.rows[0]);
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
