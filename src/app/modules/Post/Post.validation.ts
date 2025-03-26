import { z } from "zod";

const createPostSchema = z.object({
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
  image: z.array(z.string()).optional().default([]),
});

const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Content cannot be empty",
    })
    .optional(),
  image: z.array(z.string()).optional(),
});

export const postValidation = {
  createPostSchema,
  updatePostSchema,
};
