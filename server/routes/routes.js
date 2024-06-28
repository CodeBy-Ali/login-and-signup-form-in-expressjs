import express from "express";
import { Router } from "express";
import { sendHomePage } from "../controllers/homeController.js";
import validateAuthInput from "../middlewares/validateAuthInput.js";
import { renderDashboardView } from "../controllers/dashboardController.js";
import {
  sendLoginPage,
  sendSignUpPage,
  authenticateUser,
  registerNewUser,
} from "../controllers/authController.js";


const router = Router();

// home
router.get("/", sendHomePage);

// register
router.get("/register", sendSignUpPage);
router.post("/register", validateAuthInput, registerNewUser);

// login
router.get("/login", sendLoginPage);
router.post("/login", validateAuthInput, authenticateUser,);

// dashboard
router.get("/dashboard",renderDashboardView)

export default router;
