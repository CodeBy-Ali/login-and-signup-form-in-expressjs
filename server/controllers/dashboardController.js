import User from "../models/userModel.js";
export const renderDashboardView = async (req, res, next) => {
  try {
    const userId = req.session.user;
    const user = await User.findById(userId);
    const userName = user.email.slice(0,user.email.indexOf('@'));
    res.render('dashboard',{user: userName});  
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}