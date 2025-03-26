import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const createBlog = async (payload: Prisma.BlogCreateInput) => {
  const isExist = await prisma.blog.findFirst({
    where: {
      title: {
        contains: payload.title,
        mode: "insensitive",
      },
    },
  });

  if (isExist)
    throw new ApiError(httpStatus.BAD_REQUEST, "blog exist with the title");

  const blog = await prisma.blog.create({
    data: payload,
  });

  return blog;
};

const getAllBlogs = async (
  options: IPaginationOptions,
  params: { eventId: string; searchTerm?: string }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { eventId, searchTerm } = params;

  const andConditions: Prisma.BlogWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["title", "content"].map((key) => {
        return {
          [key]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (eventId) {
    andConditions.push({
      event_id: eventId,
    });
  }

  const whereConditions: Prisma.BlogWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      event: true,
    },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No blogs found");
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

const getBlog = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      event: true,
    },
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

const updateBlog = async (id: string, payload: Prisma.BlogUpdateInput) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: payload,
  });

  return updatedBlog;
};

const deleteBlog = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Blog not found");
  }

  await prisma.blog.delete({
    where: { id },
  });
};

export const blogService = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
};
