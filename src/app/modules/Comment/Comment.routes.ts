import express from "express";
import { CommentController } from "./Comment.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { commentValidation } from "./Comment.validation";

const router = express.Router();

// Route to create a comment
router.post(
  "/",
  auth(UserRole.USER),  // Assuming only users can create comments, adjust if needed
  validateRequest(commentValidation.createCommentSchema),
  CommentController.createComment
);

// Route to get all comments (with optional filters)
router.get(
  "/",
  CommentController.getAllComments
);

// Route to get a specific comment by ID
router.get(
  "/:id",
  CommentController.getComment
);

// Route to update a comment by ID
router.patch(
  "/:id",
  auth(UserRole.USER),  // Assuming only users can update their own comments
  validateRequest(commentValidation.updateCommentSchema),
  CommentController.updateComment
);

// Route to delete a comment by ID
router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),  // Assuming only users or admin can delete their own comments,  
  CommentController.deleteComment
);

export const commentRoutes = router;
