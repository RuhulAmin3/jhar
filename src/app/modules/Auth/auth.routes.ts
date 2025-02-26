import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { authValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(authValidation.registerUserValidationSchema),
  AuthController.registerUser
);

// user login route
router.post(
  "/login",
  validateRequest(authValidation.loginUserValidationSchema),
  AuthController.loginUser
);

// user logout route
router.post(
  "/logout", 
  AuthController.logoutUser
);

router.get(
  "/profile",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.SUPER_ADMIN),
  AuthController.getMyProfile
);

router.put(
  "/change-password",
  auth(),
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
