import { db } from "../config/db.js";

export const checkInMember = async (user_id, admin_id, gymId) => {

  const alreadyChecked = await db.query(`
    SELECT id
    FROM attendance
    WHERE user_id = $1
    AND gym_id = $2
    AND DATE(check_in_time) = CURRENT_DATE
    LIMIT 1
  `,[user_id, gymId]);

  if(alreadyChecked.rows.length > 0){
    return { alreadyChecked: true };
  }

  const result = await db.query(`
    INSERT INTO attendance
    (user_id, session_id, created_by, gym_id)
    VALUES ($1, NULL, $2, $3)
    RETURNING *
  `,[user_id, admin_id, gymId]);

  return { inserted: result.rows[0] };

};

export const getMemberStats = async (user_id, gymId) => {

  const result = await db.query(`
    SELECT
      COUNT(*) AS total_visits,
      COUNT(*) FILTER (
        WHERE date_trunc('month', check_in_time) = date_trunc('month', NOW())
      ) AS visits_this_month,
      MAX(check_in_time) AS last_visit
    FROM attendance
    WHERE user_id = $1
      AND gym_id = $2
  `,[user_id, gymId]);

  return result.rows[0];

};

export const checkedInToday = async (user_id, gymId) => {

  const result = await db.query(`
    SELECT id
    FROM attendance
    WHERE user_id = $1
      AND gym_id = $2
    AND DATE(check_in_time) = CURRENT_DATE
    LIMIT 1
  `,[user_id, gymId]);

  return result.rows.length > 0;

};