import { z } from "zod";

const createCommentSchema = z.object({
  post_id: z.string({
    required_error: "Post ID is required",
  }),
  content: z.string({
    required_error: "Content is required",
  }),
});

const updateCommentSchema = z.object({
  post_id: z.string().optional(),
  content: z.string().optional(),
});

export const commentValidation = {
  createCommentSchema,
  updateCommentSchema,
};
