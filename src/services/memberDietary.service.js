import { db } from '../config/db.js';

export async function getDietaryInfo(userId) {
  const { rows } = await db.query(
    'SELECT * FROM member_dietary_info WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
}

export async function updateDietaryInfo(userId, data) {
  const {
    diet_type,
    meals_per_day,
    water_per_day,
    foods_avoid,
    supplements,
    hydration_goal,
    allergies,
    restrictions,
    preferred_checkin_day,
  } = data;

  const { rows } = await db.query(
    `
    INSERT INTO member_dietary_info
      (user_id, diet_type, meals_per_day, water_per_day, foods_avoid, supplements, hydration_goal, allergies, restrictions, preferred_checkin_day)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    ON CONFLICT (user_id)
    DO UPDATE SET
      diet_type = EXCLUDED.diet_type,
      meals_per_day = EXCLUDED.meals_per_day,
      water_per_day = EXCLUDED.water_per_day,
      foods_avoid = EXCLUDED.foods_avoid,
      supplements = EXCLUDED.supplements,
      hydration_goal = EXCLUDED.hydration_goal,
      allergies = EXCLUDED.allergies,
      restrictions = EXCLUDED.restrictions,
      preferred_checkin_day = EXCLUDED.preferred_checkin_day,
      updated_at = NOW()
    RETURNING *;
    `,
    [userId, diet_type, meals_per_day, water_per_day, foods_avoid, supplements, hydration_goal, allergies, restrictions, preferred_checkin_day]
  );

  return rows[0];
}