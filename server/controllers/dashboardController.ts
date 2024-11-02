import { NextFunction,Request,Response } from "express";
import User from "../models/userModel.js";
export const renderDashboardView = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId = req.session.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.render('404', { title: "User not found" });
    }
    const userName = user.name || user.email.slice(0,user.email.indexOf('@'));
    const picture = user.authMethod === 'google' ? user.profilePicture : '';
    res.render('dashboard',{user: userName,picture});  
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}