import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { commentService } from "./Comment.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createComment = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    const userId = req.user.id;
    const comment = await commentService.createComment(userId, data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: comment,
    });
  }
);

const getAllComments = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters = pick(req.query, ["postId", "userId", "searchTerm"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const comments = await commentService.getAllComments(options, filters as any);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All comments retrieved successfully",
      data: comments,
    });
  }
);

const getComment = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const commentId = req.params.id;
    const comment = await commentService.getComment(commentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment retrieved successfully",
      data: comment,
    });
  }
);

const updateComment = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const commentId = req.params.id;
    const data = req.body;
    const comment = await commentService.updateComment(commentId, data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully",
      data: comment,
    });
  }
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const commentId = req.params.id;
    await commentService.deleteComment(commentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment deleted successfully",
      data: null,
    });
  }
);

export const CommentController = {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
