import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";


const __dirname = dirname(fileURLToPath(import.meta.url));

export const viewMemberPortal = async (req, res, next) =>  { 
    return res.render("dashboard/member-portal" , { 
      activePage: "portal"
   });
};

