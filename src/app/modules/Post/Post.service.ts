import { Post, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const createPost = async (userId: string, payload: Post) => {
  payload["user_id"] = userId;

  const post = await prisma.post.create({
    data: payload,
  });

  return post;
};

const getAllPosts = async (
  options: IPaginationOptions,
  params: { eventId: string; searchTerm?: string }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { eventId, searchTerm } = params;

  const andConditions: Prisma.PostWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      content: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }

  if (eventId) {
    andConditions.push({
      event_id: eventId,
    });
  }

  const whereConditions: Prisma.PostWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.post.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: true,
      event: true,
      comments: true,
    },
  });

  const total = await prisma.post.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No posts found");
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getPost = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      event: true,
      comments: true,
    },
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};

const updatePost = async (id: string, payload: Prisma.PostUpdateInput) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: payload,
  });

  return updatedPost;
};

const deletePost = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
  }

  await prisma.post.delete({
    where: { id },
  });
};

const myPosts = async (options: IPaginationOptions, userId: string) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const posts = await prisma.post.findMany({
    where: {
      user_id: userId,
    },
    take: limit,
    skip,
  });

  const total = await prisma.post.count({
    where: {
      user_id: userId,
    },
    take: limit,
    skip,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: posts,
  };
};

const likeUnlikePost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
  }

  // Check if the user already liked the post
  if (!post.likes.includes(userId)) {
    // Like the post: Add userId to the likes array
    await prisma.post.update({
      where: { id },
      data: {
        likes: {
          push: userId, // Add userId to the array
        },
      },
    });
  } else {
    // Unlike the post: Remove userId from the likes array
    await prisma.post.update({
      where: { id },
      data: {
        likes: {
          set: post.likes.filter((like) => like !== userId), // Remove the userId from the array
        },
      },
    });
  }

  // Return the updated post
  return post;
};

export const postService = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  likeUnlikePost,
  myPosts
};
