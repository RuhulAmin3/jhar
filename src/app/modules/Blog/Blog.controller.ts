import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { blogService } from "./Blog.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createBlog = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    const blog = await blogService.createBlog(data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Blog created successfully",
      data: blog,
    });
  }
);

const getAllBlogs = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters = pick(req.query, ["eventId", "searchTerm"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const blogs = await blogService.getAllBlogs(options, filters as any);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All blogs retrieved successfully",
      data: blogs,
    });
  }
);

const getBlog = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blogId = req.params.id;
    const blog = await blogService.getBlog(blogId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Blog retrieved successfully",
      data: blog,
    });
  }
);

const updateBlog = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blogId = req.params.id;
    const data = req.body;
    const blog = await blogService.updateBlog(blogId, data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Blog updated successfully",
      data: blog,
    });
  }
);

const deleteBlog = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blogId = req.params.id;
    await blogService.deleteBlog(blogId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Blog deleted successfully",
      data: null,
    });
  }
);

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
};
