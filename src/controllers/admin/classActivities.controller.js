import * as classTypesService from "../../services/classTypes.service.js";
import * as sessionsService from "../../services/classSessions.service.js";


// - - actual page - - //

export const getClassActivities = async (req, res, next) =>  { 

    const classTypes = await classTypesService.getAll();
    const sessions = await sessionsService.getAllSessions();

    return res.render("admin/admin-class-activities" , { 
      activePage: "classes",
      classTypes,
      sessions
   });
};


// - - class type controllers - - //


export const getAllClassTypes = async (req, res) => {
    try {
        const classTypes = await classTypesService.getAll();
        res.status(200).json(classTypes);
    } catch (error) {
      console.error("CREATE CLASS ERROR:", error);
        res.status(500).json({ message: "Failed to fetch class types" });
    }
};

export const createClassType = async (req, res) => {
    try {
        const newClass = await classTypesService.createClassType(req.body);
        res.status(201).json(newClass, {
         message: "Class created successfully.",
        });
    } catch (error) {
      console.error("CREATE CLASS ERROR:", error);
      // Unique constraint violation
    if (error.code === "23505") {
        return res.status(409).json({
            message: `${req.body.name} already exists.`
        });
    }
        res.status(500).json({ message: "Failed to create class type" });
    }
};

export const updateClassType = async (req, res) => {
    try {
        const updated = await classTypesService.updateClassType(
            req.params.id,
            req.body
        );
        res.status(200).json(updated, {
         message: "Class updated successfully."
        });
    } catch (error) {
      // console.error("CREATE CLASS ERROR:", error);
        res.status(500).json({ message: "Failed to update class type" });
    }
};

export const deleteClassType = async (req, res) => {
    try {
        await classTypesService.deleteClassType(req.params.id);
        res.status(200).json({ message: "Class type deleted successfully." });
    } catch (error) {
      // console.error("CREATE CLASS ERROR:", error);
        res.status(500).json({ message: "Failed to delete class type" });
    }
};


// - - class sessions controllers - - //
