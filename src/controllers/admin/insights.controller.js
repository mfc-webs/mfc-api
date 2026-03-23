import {
  getSummaryStats,
  getGoalStats,
  getAttendanceTrend,
  getInactiveUsers,
  getActiveUsers,
  getAtRiskUsers,
  getAvgVisits,
  getTodayCheckIns,
  getTodayCheckInsCount,
  getInactiveUsersCount
} from "../../services/insights.service.js";

export const viewAdminInsights = async (req, res, next) => {
  try {

    const checkinsPage = parseInt(req.query.checkinsPage) || 1;
    const inactivePage = parseInt(req.query.inactivePage) || 1;

    const limit = 5;

    const checkinsOffset = (checkinsPage - 1) * limit;
    const inactiveOffset = (inactivePage - 1) * limit;

   const [
  summary,
  goals,
  trend,
  activeMembers,
  atRiskMembers,
  avgVisits,
  checkedIns,
  totalCheckIns,
  inactiveUsers,
  totalInactiveUsers 
] = await Promise.all([
  getSummaryStats(),
  getGoalStats(),
  getAttendanceTrend(),
  getActiveUsers(),                
  getAtRiskUsers(),
  getAvgVisits(),
   getTodayCheckIns(limit, checkinsOffset),
  getTodayCheckInsCount(),
  getInactiveUsers(limit, inactiveOffset),
  getInactiveUsersCount()
]);

    const totalCheckinPages = Math.ceil(totalCheckIns / limit);
    const totalInactivePages = Math.ceil(totalInactiveUsers / limit);


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
      avgVisits,
      checkedIns,
      // 👇 separate pagination
      checkinsPage,
      totalCheckinPages,
      inactivePage,
      totalInactivePages
    });
  } catch (err) {
    next(err);
  }
};