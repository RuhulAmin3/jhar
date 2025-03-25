// Category.controller: Module file for the Category.controller functionality.

import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { uploadFileService } from "./UploadFile.service";
import ApiError from "../../../errors/ApiErrors";

const createFile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    const file = req.files;
    if (!file) throw new ApiError(httpStatus.BAD_REQUEST, "file is required");
    const result = await uploadFileService.createFile(data, file as any[]);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "file uploaded successfully",
      data: result,
    });
  }
);

const getAllFiles = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters = pick(req.query, ["searchTerm", "type", "section"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const files = await uploadFileService.getAllFiles(options);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "all files retrieved successfully",
      data: files,
    });
  }
);

const updateFile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    const fileId = req.params.id;
    const file = req.files;

    const updatedFile = await uploadFileService.updateFile(
      fileId,
      file as any[],
      data
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "file updated successfully",
      data: updatedFile,
    });
  }
);

const getFile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    const category = await uploadFileService.getFile(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "file retrieved successfully",
      data: category,
    });
  }
);

const deleteFile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    await uploadFileService.deleteFile(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "file deleted successfully",
      data: null,
    });
  }
);

export const UploadFileController = {
  createFile,
  deleteFile,
  getAllFiles,
  getFile,
  updateFile,
};
