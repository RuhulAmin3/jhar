import { Comment, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

 
const createComment = async (userId: string, payload: Comment) => {

  payload["user_id"] = userId;

  const comment = await prisma.comment.create({
    data: {
      ...payload,
      post_id: payload.post_id || "", // Ensure post_id is provided
      content: payload.content || "", // Ensure content is provided
    },
  });

  return comment;
};

const getAllComments = async (
  options: IPaginationOptions,
  params: { postId: string; userId?: string; searchTerm?: string }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { postId, userId, searchTerm } = params;

  const andConditions: Prisma.CommentWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      content: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }

  if (postId) {
    andConditions.push({
      post_id: postId,
    });
  }

  if (userId) {
    andConditions.push({
      user_id: userId,
    });
  }

  const whereConditions: Prisma.CommentWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.comment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: true,
      post: true,
    },
  });

  const total = await prisma.comment.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No comments found");
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

const getComment = async (id: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: true,
      post: true,
    },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  return comment;
};

const updateComment = async (
  id: string,
  payload: Prisma.CommentUpdateInput
) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: payload,
  });

  return updatedComment;
};

const deleteComment = async (id: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found");
  }

  await prisma.comment.delete({
    where: { id },
  });
};

export const commentService = {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
