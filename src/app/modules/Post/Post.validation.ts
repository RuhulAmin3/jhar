import { z } from "zod";

const createPostSchema = z.object({
  user_id: z.string({
    required_error: "User ID is required",
  }),
  event_id: z.string({
    required_error: "Event ID is required",
  }),
  content: z
    .string({
      required_error: "Content is required",
    })
    .min(1, {
      message: "Content cannot be empty",
    }),
  image: z.string().optional(), // Image is optional
});

const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Content cannot be empty",
    })
    .optional(),
  image: z.string().optional(),
});

const likeUnlikePostSchema = z.object({
  user_id: z.string({
    required_error: "User ID is required",
  }),
});

export const postValidation = {
  createPostSchema,
  updatePostSchema,
  likeUnlikePostSchema,
};
