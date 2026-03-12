import { db } from "../config/db.js";

export const getSessions = async (req, res) => {

  const user_id = req.user?.sub || null;

  const result = await db.query(`
    SELECT 
      s.id,
      TO_CHAR(s.starts_at,'HH24:MI') AS time,
      TRIM(TO_CHAR(s.starts_at,'Day')) AS day,
      s.capacity,
      s.location,
      c.name AS class_name,
      (b.id IS NOT NULL) AS enrolled
    FROM class_sessions s
    JOIN class_types c ON s.class_type_id = c.id
    LEFT JOIN class_bookings b 
      ON b.session_id = s.id
      AND b.user_id = $1
    ORDER BY s.starts_at
  `,[user_id]);

  res.json(result.rows);

};