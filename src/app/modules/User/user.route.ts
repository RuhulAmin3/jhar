import express from "express";
import { userController } from "./user.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// Get all users
router.get("/", auth(UserRole.SUPER_ADMIN), userController.getUsers);

// Get user by ID
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.STUDENT),
  userController.getUserById
);

// Update user
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.STUDENT),
  userController.updateUser
);

export const userRoutes = router;
