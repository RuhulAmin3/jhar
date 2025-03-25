import { EventCategory, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const createEventCategory = async (payload: EventCategory) => {
  const isExist = await prisma.eventCategory.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (isExist)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Event category already exists with this name"
    );

  const eventCategory = await prisma.eventCategory.create({
    data: payload,
  });

  return eventCategory;
};

const getAllEventCategories = async (
  options: IPaginationOptions,
  params: { searchTerm?: string }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm } = params;

  const andConditions: Prisma.EventCategoryWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "description"].map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  const whereConditions: Prisma.EventCategoryWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.eventCategory.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      events: true,
    },
  });

  const total = await prisma.eventCategory.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No event categories found");
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

const getEventCategory = async (id: string) => {
  const result = await prisma.eventCategory.findUnique({
    where: { id },
    include: {
      events: true,
    },
  });

  if (!result) {
    throw new ApiError(404, "Event category not found");
  }
  return result;
};

const updateEventCategory = async (
  id: string,
  payload: Partial<EventCategory>
) => {
  const isExist = await prisma.eventCategory.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(404, "Event category not found");
  }

  if (payload?.name) {
    const isExistName = await prisma.eventCategory.findUnique({
      where: {
        name: payload.name,
      },
    });
    if (isExistName) {
      throw new ApiError(400, "Event category name already exist");
    }
  }

  const updatedCategory = await prisma.eventCategory.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });

  return updatedCategory;
};

const deleteEventCategory = async (id: string) => {
  const isExist = await prisma.eventCategory.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Event category not found");
  }

  await prisma.eventCategory.delete({
    where: {
      id,
    },
  });
};

export const eventCategoryService = {
  createEventCategory,
  getAllEventCategories,
  getEventCategory,
  updateEventCategory,
  deleteEventCategory,
};
