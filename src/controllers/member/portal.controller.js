import { getUpcomingSessions } from '../../services/classSessions.service.js';


export const viewMemberPortal = async (req, res, next) =>  { 
   try {
    const sessions = await getUpcomingSessions();

    res.render("dashboard/member-portal", {
      activePage: "portal",
      sessions
    });


  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

