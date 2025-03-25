import express, { NextFunction, Request, Response } from "express";
import { EventCategoryController } from "./EventCategory.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { eventCategoryValidation } from "./EventCategory.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(eventCategoryValidation.createEventCategorySchema),
  EventCategoryController.createEventCategory
);

router.get(
  "/",
  EventCategoryController.getAllEventCategories
);

router.get(
  "/:id",
  EventCategoryController.getEventCategory
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(eventCategoryValidation.updateEventCategorySchema),
  EventCategoryController.updateEventCategory
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  EventCategoryController.deleteEventCategory
);

export const eventCategoryRoutes = router;
