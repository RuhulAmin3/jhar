import { z } from "zod";

const createBlogSchema = z.object({
  title: z.string({
    required_error: "Blog title is required",
  }),
  content: z.string({
    required_error: "Content is required",
  }),
  event_id: z.string().optional(),
});

const updateBlogSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  event_id: z.string().optional(),
});

export const blogValidation = {
  createBlogSchema,
  updateBlogSchema,
};
