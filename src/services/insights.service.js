import { db } from '../config/db.js';

// 1. Summary Stats
export const getSummaryStats = async (gymId) => {
  const result = await db.query(`
    SELECT 
      COUNT(DISTINCT m.id) AS total_members,
      
      COUNT(a.id) FILTER (
        WHERE DATE(a.check_in_time) = CURRENT_DATE
      ) AS checkins_today,

      COUNT(a.id) FILTER (
        WHERE a.check_in_time >= NOW() - INTERVAL '7 days'
      ) AS checkins_week

    FROM users m
    LEFT JOIN attendance a 
      ON m.id = a.user_id
     AND a.gym_id = $1
    WHERE m.gym_id = $1
    AND role = 'member'
  `, [gymId]);

  return result.rows[0];
};

// 2. Goals Distribution
export const getGoalStats = async (gymId) => {
  const result = await db.query(`
    SELECT primary_goal, COUNT(*) as count
    FROM member_physique_lifestyle
    WHERE gym_id = $1
    GROUP BY primary_goal
  `, [gymId]);

  return result.rows;
};

// 3. Attendance Trend (Last 6 months)
export const getAttendanceTrend = async (gymId) => {
  const result = await db.query(`
    SELECT 
      DATE_TRUNC('month', check_in_time) AS month,
      COUNT(*) AS count
    FROM attendance
    WHERE check_in_time >= NOW() - INTERVAL '6 months'
      AND gym_id = $1
    GROUP BY month
    ORDER BY month ASC
  `, [gymId]);

  return result.rows;
};

// 4. Inactive Users (7+ days)
export const getInactiveUsers = async (gymId, limit = 5, offset = 0) => {
  const result = await db.query(`
    SELECT 
      m.id,
      m.firstname,
      m.lastname,
      m.phone,
      MAX(a.check_in_time) as last_checkin
    FROM users m
    LEFT JOIN attendance a 
      ON m.id = a.user_id
     AND a.gym_id = $1
    WHERE m.gym_id = $1
    GROUP BY m.id, m.firstname, m.lastname, m.phone
    HAVING 
      MAX(a.check_in_time) IS NULL
      OR MAX(a.check_in_time) < NOW() - INTERVAL '7 days'
    ORDER BY last_checkin ASC
    LIMIT $2 OFFSET $3
  `, [gymId, limit, offset]);

  return result.rows;
};

// 5. Active Users (last 7 days)
export const getActiveUsers = async (gymId) => {
  const result = await db.query(`
    SELECT COUNT(DISTINCT user_id) AS active_members
    FROM attendance
    WHERE check_in_time >= NOW() - INTERVAL '7 days'
      AND gym_id = $1
  `, [gymId]);

  return Number(result.rows[0].active_members);
};

// 6. At-Risk Users (last 7–14 days)
export const getAtRiskUsers = async (gymId) => {
  const result = await db.query(`
    SELECT COUNT(*) as count
    FROM (
      SELECT m.id, MAX(a.check_in_time) as last_checkin
      FROM users m
      LEFT JOIN attendance a 
        ON m.id = a.user_id
       AND a.gym_id = $1
      WHERE m.gym_id = $1
      GROUP BY m.id
    ) sub
    WHERE last_checkin < NOW() - INTERVAL '7 days'
      AND last_checkin >= NOW() - INTERVAL '14 days'
  `, [gymId]);

  return Number(result.rows[0].count);
};

// 7. Average visits (last 30 days)
export const getAvgVisits = async (gymId) => {
  const result = await db.query(`
    SELECT 
      COALESCE(
        COUNT(*)::float / NULLIF(COUNT(DISTINCT user_id), 0),
        0
      ) AS avg_visits
    FROM attendance
    WHERE check_in_time >= NOW() - INTERVAL '30 days'
      AND gym_id = $1
  `, [gymId]);

  return Number(result.rows[0].avg_visits).toFixed(1);
};

// 8. Today check-ins
export const getTodayCheckIns = async (gymId, limit = 5, offset = 0) => {
  const result = await db.query(`
    SELECT 
      u.firstname,
      u.lastname,
      a.check_in_time
    FROM attendance a
    JOIN users u 
      ON u.id = a.user_id
     AND u.gym_id = $1
    WHERE DATE(a.check_in_time) = CURRENT_DATE
      AND a.gym_id = $1
    ORDER BY a.check_in_time DESC
    LIMIT $2 OFFSET $3
  `, [gymId, limit, offset]);

  return result.rows;
};

export const getTodayCheckInsCount = async (gymId) => {
  const result = await db.query(`
    SELECT COUNT(*) 
    FROM attendance
    WHERE DATE(check_in_time) = CURRENT_DATE
      AND gym_id = $1
  `, [gymId]);

  return parseInt(result.rows[0].count);
};

export const getInactiveUsersCount = async (gymId) => {
  const result = await db.query(`
    SELECT COUNT(*)
    FROM attendance
    WHERE DATE(check_in_time) < NOW() - INTERVAL '7 days'
      AND gym_id = $1
  `, [gymId]);

  return parseInt(result.rows[0].count);
};