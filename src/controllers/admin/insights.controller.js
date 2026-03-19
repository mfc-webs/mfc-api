import {
  getSummaryStats,
  getGoalStats,
  getAttendanceTrend,
  getInactiveUsers,
  getActiveUsers,
  getAtRiskUsers,
  getAvgVisits
} from "../../services/insights.service.js";

export const viewAdminInsights = async (req, res, next) => {
  try {
    const [summary, goals, trend, inactiveUsers, activeMembers, atRiskMembers,  avgVisits ] = await Promise.all([
      getSummaryStats(),
      getGoalStats(),
      getAttendanceTrend(),
      getInactiveUsers(),
      getActiveUsers(),
      getAtRiskUsers(),
      getAvgVisits()
    ]);

    const engagementRate = summary.total_members > 0 ? ((activeMembers / summary.total_members) * 100).toFixed(1) : 0;

    res.render("admin/admin-insights", {
      activePage: "insights",
      summary,
      goals,
      trend,
      inactiveUsers,
      activeMembers,
      engagementRate,
      atRiskMembers, 
      avgVisits
    });
  } catch (err) {
    next(err);
  }
};