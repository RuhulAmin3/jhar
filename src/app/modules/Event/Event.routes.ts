import express from "express";
import { EventController } from "./Event.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { eventValidation } from "./Event.validation";

const router = express.Router();

// Route to create an event
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(eventValidation.createEventSchema),
  EventController.createEvent
);

// Route to get all events
router.get(
  "/",
  EventController.getAllEvents
);

// Route to get a specific event by ID
router.get(
  "/:id",
  EventController.getEvent
);

// Route to update an event by ID
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(eventValidation.updateEventSchema),
  EventController.updateEvent
);

// Route to delete an event by ID
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  EventController.deleteEvent
);

export const eventRoutes = router;
