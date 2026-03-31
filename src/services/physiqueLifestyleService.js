import { db } from '../config/db.js';

export async function getByMemberPhysiqueInfo(userId, gymId) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM member_physique_lifestyle
    WHERE user_id = $1
      AND gym_id = $2
    LIMIT 1
    `,
    [userId, gymId]
  );

  return rows[0] || null;
}

export async function updateMemberPhysique(userId, data, gymId) {
  const { 
    primary_goal, 
    current_weight, 
    target_weight, 
    height, 
    waist, 
    protein, 
    carbs, 
    fats, 
    notes, 
    occupation, 
    stress_level, 
    sleep_hours, 
    activity_level, 
    exercise_frequency, 
    sitting_hours, 
    current_activities, 
    training_styles
  } = data;

  const { rows } = await db.query(
    `
    INSERT INTO member_physique_lifestyle
      (
        user_id,
        gym_id,
        primary_goal,
        current_weight,
        target_weight,
        height,
        waist,
        protein,
        carbs,
        fats,
        notes,
        occupation,
        stress_level,
        sleep_hours,
        activity_level,
        exercise_frequency,
        sitting_hours,
        current_activities,
        training_styles
      )
    VALUES
      (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
    ON CONFLICT (user_id, gym_id)
    DO UPDATE SET
      primary_goal = EXCLUDED.primary_goal,
      current_weight = EXCLUDED.current_weight,
      target_weight = EXCLUDED.target_weight,
      height = EXCLUDED.height,
      waist = EXCLUDED.waist,
      protein = EXCLUDED.protein,
      carbs = EXCLUDED.carbs,
      fats = EXCLUDED.fats,
      notes = EXCLUDED.notes,
      occupation = EXCLUDED.occupation,
      stress_level = EXCLUDED.stress_level,
      sleep_hours = EXCLUDED.sleep_hours,
      activity_level = EXCLUDED.activity_level,
      exercise_frequency = EXCLUDED.exercise_frequency,
      sitting_hours = EXCLUDED.sitting_hours,
      current_activities = EXCLUDED.current_activities,
      training_styles = EXCLUDED.training_styles,
      updated_at = NOW()
    RETURNING *;
    `,
    [
      userId,
      gymId,
      primary_goal, 
      current_weight, 
      target_weight, 
      height, 
      waist, 
      protein, 
      carbs, 
      fats, 
      notes, 
      occupation, 
      stress_level, 
      sleep_hours, 
      activity_level, 
      exercise_frequency, 
      sitting_hours, 
      current_activities, 
      training_styles
    ]
  );

  return rows[0];
}