import express from "express";
import { PostController } from "./Post.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth"; // Assuming auth middleware is set up for authentication
import validateRequest from "../../middlewares/validateRequest"; // Assuming you have a middleware to validate requests
import { postValidation } from "./Post.validation";

const router = express.Router();

// Route to create a post
router.post(
  "/",
  auth(UserRole.USER), // Assuming only authenticated users can create posts
  validateRequest(postValidation.createPostSchema), // Validate incoming data
  PostController.createPost
);

// Route to get all posts (can filter by eventId or searchTerm)
router.get("/", PostController.getAllPosts);

router.get("/my-posts", auth(UserRole.USER), PostController.myPosts);

// Route to get a specific post by ID
router.get("/:id", PostController.getPost);

// Route to update a post by ID
router.patch(
  "/:id",
  auth(UserRole.USER), // Assuming users can update their own posts
  validateRequest(postValidation.updatePostSchema), // Validate incoming data for update
  PostController.updatePost
);

// Route to delete a post by ID
router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.SUPER_ADMIN), // Assuming only the post creator or an admin can delete posts
  PostController.deletePost
);

// Route to like or unlike a post (toggles like status)
router.patch("/:id/like", auth(UserRole.USER), PostController.likeUnlikePost);

export const postRoutes = router;
