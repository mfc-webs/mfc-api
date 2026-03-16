import { checkInMember } from "../../services/attendance.service.js";


// create attendace stat

export const createCheckin = async (req,res)=>{

  try{

    const { user_id } = req.body;

    const admin_id = req.user?.sub;

    if(!user_id){
      return res.status(400).json({
        error:"user_id required"
      });
    }

    const result = await checkInMember(user_id, admin_id);

if(result.alreadyChecked){
      return res.json({
        ok:false,
        message:"Member already checked in today"
      });
    }

    res.json({
      ok:true,
      message:"Member checked in"
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      error:"Check-in failed"
    });

  }

};

export const getCheckinStatus = async (req,res)=>{

  try{

    const { user_id } = req.params;

    const checked = await checkedInToday(user_id);
    
    res.json({
      checked_in_today: checked
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      error:"Failed to check attendance"
    });

  }

};