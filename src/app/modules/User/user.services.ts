import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";  
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { GENDER, Prisma, User, UserRole, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import httpStatus from "http-status";
import { IParams } from "./user.interface";

// reterive all users from the database also searcing anf filetering
const getUsersFromDb = async (
  params: IParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          }, 
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
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

// update profile by user won profile uisng token or email and id
const updateProfile = async (id: string, payload: Partial<User>) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userInfo) {
    throw new ApiError(404, "User not found");
  }

  // Update the user profile with the new information
  const result = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: {
      ...payload,
    },
  });

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user profile"
    );

  return result;
};

// get user

const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if(!user) throw new ApiError(httpStatus.BAD_REQUEST, "user not found");
  return user;
};


export const userService = {
  getUsersFromDb,
  updateProfile,
  getUserById
};
