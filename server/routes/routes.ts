import express from "express";
import { Router } from "express";
import { sendHomePage } from "../controllers/homeController.ts";
import validateAuthInput from "../middlewares/validateAuthInput.ts";
import { renderDashboardView } from "../controllers/dashboardController.ts";
import { isAuthenticated, redirectIfAuthorized } from "../middlewares/authenticate.ts";
import {
  sendLoginPage,
  sendSignUpPage,
  authenticateUser,
  registerNewUser,
  handleGoogleAuth,
  logoutUser,
  handleGoogleAuthCallback
} from "../controllers/authController.ts";


const router = Router();



// home
router.get("/", redirectIfAuthorized,sendHomePage);

// register
router.get("/register", sendSignUpPage);
router.post("/register", validateAuthInput, registerNewUser);

// login
router.get('/auth/google',handleGoogleAuth)
router.get("/login", sendLoginPage);
router.post("/login", validateAuthInput, authenticateUser);


router.get('/auth/google/callback', handleGoogleAuthCallback);

// dashboard
router.get("/dashboard", isAuthenticated, renderDashboardView);

// logout
router.post("/logout",logoutUser);
export default router;
