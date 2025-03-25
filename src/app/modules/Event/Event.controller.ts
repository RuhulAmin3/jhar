import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { eventService } from "./Event.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createEvent = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    const event = await eventService.createEvent(data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event created successfully",
      data: event,
    });
  }
);

const getAllEvents = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters = pick(req.query, [
      "searchTerm",
      "categories",
      "date",
      "minPrice",
      "maxPrice",
    ]);
    
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const events = await eventService.getAllEvents(options, filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All events retrieved successfully",
      data: events,
    });
  }
);

const getEvent = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const eventId = req.params.id;
    const event = await eventService.getEvent(eventId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event retrieved successfully",
      data: event,
    });
  }
);

const updateEvent = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const eventId = req.params.id;
    const data = req.body;
    const event = await eventService.updateEvent(eventId, data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event updated successfully",
      data: event,
    });
  }
);

const deleteEvent = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const eventId = req.params.id;
    await eventService.deleteEvent(eventId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event deleted successfully",
      data: null,
    });
  }
);

export const EventController = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
