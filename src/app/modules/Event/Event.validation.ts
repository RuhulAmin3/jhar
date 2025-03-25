import { z } from "zod";

const createEventSchema = z.object({
  title: z.string({
    required_error: "Event title is required",
  }),
  event_category_id: z.string({
    required_error: "Event category ID is required",
  }),
  event_date: z.string({
    required_error: "Event date is required",
  }),
  start_time: z.string({
    required_error: "Start time is required",
  }),
  end_time: z.string({
    required_error: "End time is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  capacity: z.number({
    required_error: "Capacity is required",
  }),
  latitude: z.string({
    required_error: "Latitude is required",
  }),
  longitude: z.string({
    required_error: "Longitude is required",
  }),
  images: z.array(z.string()).min(1, {
    message: "At least one image is required",
  }),
});

const updateEventSchema = z.object({
  title: z.string().optional(),
  event_category_id: z.string().optional(),
  event_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  description: z.string().optional(),
  capacity: z.number().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  images: z
    .array(z.string())
    .min(1, {
      message: "At least one image is required",
    })
    .optional(),
});

export const eventValidation = {
  createEventSchema,
  updateEventSchema,
};
