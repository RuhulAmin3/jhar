import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { eventCategoryService } from "./EventCategory.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createEventCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    const eventCategory = await eventCategoryService.createEventCategory(data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Event category created successfully",
      data: eventCategory,
    });
  }
);

const getAllEventCategories = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters = pick(req.query, ["searchTerm"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const eventCategories = await eventCategoryService.getAllEventCategories(
      options,
      filters as { searchTerm: string }
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All event categories retrieved successfully",
      data: eventCategories,
    });
  }
);

const updateEventCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const eventCategoryId = req.params.id;
    const data = req.body;
    const eventCategory = await eventCategoryService.updateEventCategory(
      eventCategoryId,
      data
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event category updated successfully",
      data: eventCategory,
    });
  }
);

const getEventCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const eventCategoryId = req.params.id;
    const eventCategory = await eventCategoryService.getEventCategory(
      eventCategoryId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event category retrieved successfully",
      data: eventCategory,
    });
  }
);

const deleteEventCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const eventCategoryId = req.params.id;
    const eventCategory = await eventCategoryService.deleteEventCategory(
      eventCategoryId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Event category deleted successfully",
      data: eventCategory,
    });
  }
);

export const EventCategoryController = {
  createEventCategory,
  deleteEventCategory,
  getAllEventCategories,
  getEventCategory,
  updateEventCategory,
};
