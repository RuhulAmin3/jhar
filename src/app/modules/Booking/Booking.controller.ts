import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { bookingService } from "./Booking.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createBooking = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const data = req.body;

    const booking = await bookingService.createBooking(userId, data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: booking,
    });
  }
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters = pick(req.query, ["userId", "status"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const bookings = await bookingService.getAllBookings(options, filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All bookings retrieved successfully",
      data: bookings,
    });
  }
);

const getBooking = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const bookingId = req.params.id;
    const booking = await bookingService.getBooking(bookingId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: booking,
    });
  }
);

const updateBooking = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const bookingId = req.params.id;
    const data = req.body;
    const booking = await bookingService.updateBooking(bookingId, data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking updated successfully",
      data: booking,
    });
  }
);

const deleteBooking = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const bookingId = req.params.id;
    await bookingService.deleteBooking(bookingId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking deleted successfully",
      data: null,
    });
  }
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const bookingId = req.params.id;
    const { status } = req.body;
    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId,
      status
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  }
);

export const BookingController = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
};
