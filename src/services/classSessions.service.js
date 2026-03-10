import { db } from "../config/db.js";

// Helper to calculate end_at from start_at and duration
function calcEndAt(startAt, durationMinutes) {
  return new Date(new Date(startAt).getTime() + durationMinutes * 60000); // ms
}

export const createClassSession = async (data) => {
  try {
    // get class_type info
    const classType = await db.query(
      `SELECT id, default_duration_minutes, description 
      FROM class_types 
      WHERE id = $1 LIMIT 1`,
      [data.class_type_id]
    );

    if (!classType.rows[0]) throw new Error("Class type not found");

    const startAt = new Date(`${data.date} ${data.time}`);
    const endAt = calcEndAt(startAt, classType.rows[0].default_duration_minutes);

    const query = `
      INSERT INTO class_sessions
        (
        class_type_id,
        trainer_id,
        start_time,
        starts_at,
        ends_at,
        capacity,
        location,
        status,
        created_at,
        updated_at,
        waitlist_enabled,
        cancellation_deadline_hours
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW(),$9,$10)
      RETURNING *
    `;

    const values = [
      classType.rows[0].id,          
      data.trainer_id || null,       
      data.time,                      
      startAt,                        
      endAt,                          
      data.capacity,                 
      data.location,                 
      data.status || "scheduled",     
      data.waitlist_enabled || false,
      data.cancellation_deadline_hours || 24 
    ];

    const result = await db.query(query, values);

    return result.rows[0];
    
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    throw err;
  }
};

export const getAllSessions = async () => {
  const query = `
    SELECT
      s.id,
      s.starts_at,
      s.ends_at,
      s.capacity,
      s.location,
      s.status,
      s.trainer_id,
      c.name AS class_name,
      c.description,
      c.default_duration_minutes
    FROM class_sessions s
    JOIN class_types c ON c.id = s.class_type_id
    ORDER BY s.starts_at ASC
  `;

  const result = await db.query(query);

  return result.rows;
};