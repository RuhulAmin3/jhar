import express from "express";
import { BookingController } from "./Booking.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { bookingValidation } from "./Booking.validation";

const router = express.Router();

// Route to create a new booking
router.post(
  "/",
  auth(UserRole.USER), // Assuming only authenticated users can create bookings
  validateRequest(bookingValidation.createBookingSchema),
  BookingController.createBooking
);

// Route to get all bookings
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN), // Assuming admins can view all bookings, you can adjust this as per your requirements
  BookingController.getAllBookings
);

// Route to get a specific booking by ID
router.get(
  "/:id",
  auth(UserRole.USER), // Assuming users can view their own booking
  BookingController.getBooking
);

// Route to update booking status by ID
router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN), // Assuming only admins can update booking status
  validateRequest(bookingValidation.updateBookingSchema),
  BookingController.updateBookingStatus
);

// Route to update booking details by ID (you can customize this if needed)
router.patch(
  "/:id",
  auth(UserRole.USER), // Assuming users can update their own booking
  validateRequest(bookingValidation.createBookingSchema), // Customize if necessary
  BookingController.updateBooking
);

// Route to delete a booking by ID
router.delete(
  "/:id",
  auth(UserRole.USER), // Assuming users can delete their own booking
  BookingController.deleteBooking
);

export const bookingRoutes = router;
