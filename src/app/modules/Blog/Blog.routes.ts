import express from "express";
import { BlogController } from "./Blog.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { blogValidation } from "./Blog.validation";

const router = express.Router();

// Route to create a blog
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(blogValidation.createBlogSchema),
  BlogController.createBlog
);

// Route to get all blogs
router.get(
  "/",
  BlogController.getAllBlogs
);

// Route to get a specific blog by ID
router.get(
  "/:id",
  BlogController.getBlog
);

// Route to update a blog by ID
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(blogValidation.updateBlogSchema),
  BlogController.updateBlog
);

// Route to delete a blog by ID
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  BlogController.deleteBlog
);

export const blogRoutes = router;
