import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { postService } from "./Post.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";  // Assuming you have a helper for picking query params

const createPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    const userId = req.user.id;
    const post = await postService.createPost(userId,  data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: post,
    });
  }
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filters = pick(req.query, ["eventId", "searchTerm"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const posts = await postService.getAllPosts(options, filters as any);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts retrieved successfully",
      data: posts,
    });
  }
);

const myPosts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => { 
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const userId = req.user.id;
    const posts = await postService.myPosts(options, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "my posts retrieved successfully",
      data: posts,
    });
  }
);

const getPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const postId = req.params.id;
    const post = await postService.getPost(postId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post retrieved successfully",
      data: post,
    });
  }
);

const updatePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const postId = req.params.id;
    const data = req.body;
    const updatedPost = await postService.updatePost(postId, data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully",
      data: updatedPost,
    });
  }
);

const deletePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const postId = req.params.id;
    await postService.deletePost(postId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully",
        data: undefined
    });
  }
);

const likeUnlikePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user.id;  // Assuming user ID is added via authentication middleware
    const post = await postService.likeUnlikePost(postId, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post liked/unliked successfully",
      data: post,
    });
  }
);

export const PostController = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  likeUnlikePost,
  myPosts,
};
