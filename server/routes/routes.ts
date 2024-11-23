import express from "express";
import {Router} from "express";
import {sendHomePage} from "../controllers/homeController.js";
import validateAuthInput from "../middlewares/validateAuthInput.js";
import {renderDashboardView} from "../controllers/dashboardController.js";
import {isAuthenticated, redirectIfAuthorized} from "../middlewares/authenticate.js";
import {
    sendLoginPage,
    sendSignUpPage,
    authenticateUser,
    registerNewUser,
    handleGoogleAuth,
    logoutUser,
    handleGoogleAuthCallback
} from "../controllers/authController.js";


const router = Router();


// home
router.get("/", redirectIfAuthorized, sendHomePage);

// register
router.get("/register", sendSignUpPage);
router.post("/register", validateAuthInput, registerNewUser);

// login
router.get('/auth/google', handleGoogleAuth)
router.get("/login", sendLoginPage);
router.post("/login", validateAuthInput, authenticateUser);


router.get('/auth/google/callback', handleGoogleAuthCallback);

// dashboard
router.get("/dashboard", isAuthenticated, renderDashboardView);

// logout
router.post("/logout", logoutUser);
export default router;
