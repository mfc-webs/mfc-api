import { db } from "../config/db.js";

export const getSessions = async (req, res) => {

  const user_id = req.user?.sub || null;
  const gymId = req.gymId;

  const result = await db.query(`
    SELECT 
      s.id,
      s.starts_at,
      TO_CHAR(s.starts_at,'HH24:MI') AS time,
      TRIM(TO_CHAR(s.starts_at,'Day')) AS day,
      s.capacity,
      s.location,
      s.gym_id,
      c.name AS class_name,
      (b.id IS NOT NULL) AS enrolled,
    FROM class_sessions s
    JOIN class_types c 
    ON s.class_type_id = c.id
    AND c.gym_id = $2
    LEFT JOIN class_bookings b 
      ON b.session_id = s.id
      AND b.user_id = $1::int
      AND b.gym_id = $2
      WHERE s.gym_id = $2
    ORDER BY s.starts_at
  `,[user_id, gymId]);

  if (!user_id) {
  result.rows.forEach(s => s.location = null);
  }

  res.json(result.rows);

};