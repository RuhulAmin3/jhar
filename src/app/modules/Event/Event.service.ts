import { fileUploader } from "./../../../helpars/fileUploader";
import { Event, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const createEvent = async (payload: Event) => {
  const event = await prisma.event.create({
    data: payload,
  });
  return event;
};

const getAllEvents = async (
  options: IPaginationOptions,
  params: {
    searchTerm?: string;
    categories?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
  }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, categories, date, minPrice, maxPrice } = params;

  const andConditions: Prisma.EventWhereInput[] = [];

  // Search filter by description
  if (searchTerm) {
    andConditions.push({
      OR: ["title"].map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  const event_categories = categories
    ? categories.split(",").map((id) => id.trim()) // Split the string by commas and trim any extra spaces
    : [];

  if (event_categories && event_categories.length > 0) { 
    andConditions.push({
      event_category_id: {
        in: event_categories, // Apply the filter to check if event_category_id matches any of the values in event_categories array
      },
    });
  }

  // Date range filter
  if (date) {
    andConditions.push({
      event_date: {
        equals: new Date(date), // Greater than or equal to start date
      },
    });
  }

  // Price range filter (filtering by price within EventType)
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceConditions: Prisma.EventWhereInput[] = [];

    if (minPrice !== undefined) {
      priceConditions.push({
        event_types: {
          some: {
            price: {
              gte: Number(minPrice), // Filter by minimum price
            },
          },
        },
      });
    }

    if (maxPrice !== undefined) {
      priceConditions.push({
        event_types: {
          some: {
            price: {
              lte: Number(maxPrice), // Filter by maximum price
            },
          },
        },
      });
    }

    andConditions.push(...priceConditions);
  }

  const whereConditions: Prisma.EventWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      event_category: true,
      blogs: true,
      posts: true,
    },
  });

  const total = await prisma.event.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No events found");
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

const getEvent = async (id: string) => {
  const result = await prisma.event.findUnique({
    where: { id },
    include: {
      event_category: true,
      blogs: true,
      posts: true,
    },
  });

  if (!result) {
    throw new ApiError(404, "Event not found");
  }

  return result;
};

const updateEvent = async (id: string, payload: Partial<Event>) => {
  const isExist = await prisma.event.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(404, "Event not found");
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });

  return updatedEvent;
};

const deleteEvent = async (id: string) => {
  const isExist = await prisma.event.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Event not found");
  }

  if (isExist?.images?.length > 0) {
    for (const image of isExist.images) {
      await fileUploader.deleteFromDigitalOceanAWS(image);
    }
  }

  await prisma.event.delete({
    where: {
      id,
    },
  });
};

export const eventService = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
