import { getMemberStats } from "../../services/attendance.service.js";


// get attendance stats

export const getMyStats = async (req,res)=>{

  try{

    const user_id = req.user?.sub;
    const gymId = req.gymId;

    const stats = await getMemberStats(user_id, gymId);

    res.json(stats);

  }catch(err){

    console.error(err);

    res.status(500).json({
      error:"Failed to load stats"
    });

  }

};