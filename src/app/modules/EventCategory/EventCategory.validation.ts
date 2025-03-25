import { z } from "zod";

const createEventCategorySchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
});

const updateEventCategorySchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }).optional(),
  description: z.string({
    required_error: 'Description is required',
  }).optional(),
});

export const eventCategoryValidation = {
  createEventCategorySchema,
  updateEventCategorySchema,
};
