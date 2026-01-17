import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const viewMemberPortal = async (req, res, next) => {

   res.sendFile(path.join(__dirname, "..", "..", "..", "views", "dashboard", "member-portal.html"));

};

export const viewMemberNutrition = async (req, res, next) => {

   res.sendFile(path.join(__dirname,"..", "..", "..", "views", "dashboard", "member-nutrition.html"));

};

export const viewMemberActivities = async (req, res, next) => {

   res.sendFile(path.join(__dirname, "..", "..", "..", "views", "dashboard", "member-activities.html"));

};

export const viewMemberPersonalDetails= async (req, res, next) => {

   res.sendFile(path.join(__dirname, "..", "..", "..", "views", "dashboard", "member-personal-details.html"));

};

export const viewEditProfile = async (req, res, next) => {

   res.sendFile(path.join(__dirname, "..", "..", "..", "views", "dashboard", "member-edit-profile.html"));

};

export const viewMemberBlling = async (req, res, next) => {

   res.sendFile(path.join(__dirname, "..", "..", "..", "views", "dashboard", "member-billing.html"));

};

export const viewMemberReports = async (req, res, next) => {

   res.sendFile(path.join(__dirname, "..", "..", "..", "views", "dashboard", "member-reports.html"));

};