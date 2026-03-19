import { db } from '../config/db.js';

// 1. Summary Stats
export const getSummaryStats = async () => {
  const result = await db.query(`
    SELECT 
      COUNT(DISTINCT m.id) AS total_members,
      
      COUNT(a.id) FILTER (
        WHERE DATE(a.check_in_time) = CURRENT_DATE
      ) AS checkins_today,

      COUNT(a.id) FILTER (
        WHERE a.check_in_time >= NOW() - INTERVAL '7 days'
      ) AS checkins_week

    FROM Users m
    LEFT JOIN attendance a ON m.id = a.user_id
  `);

  return result.rows[0];
};

// 2. Goals Distribution
export const getGoalStats = async () => {
   const result = await db.query(`
    SELECT primary_goal, COUNT(*) as count
    FROM member_physique_lifestyle
    GROUP BY primary_goal
  `);

  return result.rows;
};

// 3. Attendance Trend (Last 30 days)
export const getAttendanceTrend = async () => {
  const result = await db.query(`
     SELECT 
      DATE_TRUNC('month', check_in_time) AS month,
      COUNT(*) AS count
    FROM attendance
    WHERE check_in_time >= NOW() - INTERVAL '6 months'
    GROUP BY month
    ORDER BY month ASC
  `);

  return result.rows;
};

// 4. Inactive Users (7+ days)
export const getInactiveUsers = async () => {
  const result = await db.query(`
    SELECT 
      m.id,
      m.firstname,
      m.lastname,
      m.phone,
      MAX(a.check_in_time) as last_checkin

    FROM Users m
    LEFT JOIN attendance a ON m.id = a.user_id

    GROUP BY m.id, m.firstname, m.lastname, m.phone

    HAVING 
      MAX(a.check_in_time) IS NULL
      OR MAX(a.check_in_time) < NOW() - INTERVAL '7 days'

    ORDER BY last_checkin ASC
  `);

  return result.rows;
};

export const getActiveUsers = async () => {
  const result = await db.query(`
    SELECT COUNT(DISTINCT user_id) AS active_members
    FROM attendance
    WHERE check_in_time >= NOW() - INTERVAL '7 days'
  `);

  return Number(result.rows[0].active_members);
};

export const getAtRiskUsers = async () => {
  const result = await db.query(`
    SELECT COUNT(*) as count
    FROM (
      SELECT m.id, MAX(a.check_in_time) as last_checkin
      FROM users m
      LEFT JOIN attendance a ON m.id = a.user_id
      GROUP BY m.id
    ) sub
    WHERE last_checkin < NOW() - INTERVAL '7 days'
      AND last_checkin >= NOW() - INTERVAL '14 days'
  `);

  return Number(result.rows[0].count);
};

export const getAvgVisits = async () => {
  const result = await db.query(`
    SELECT 
      COUNT(*)::float / COUNT(DISTINCT user_id) AS avg_visits
    FROM attendance
    WHERE check_in_time >= NOW() - INTERVAL '30 days'
  `);

  return Number(result.rows[0].avg_visits).toFixed(1);
};