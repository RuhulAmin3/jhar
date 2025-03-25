import { File, FileType, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { uploadFilesToDigitalOcean } from "../../../helpars/utils";
import { deleteFromDigitalOceanAWS } from "../../../helpars/fileUploader";

const createFile = async (payload: File, files: any[]) => {
  const images = await uploadFilesToDigitalOcean(files);
  const createdFiles = await Promise.all(
    images.map(async (img: string) => {
      const uploadFile = await prisma.file.create({
        data: {
          ...payload,
          url: img,
        },
      });
      return uploadFile;
    })
  );

  return createdFiles;
};

const getAllFiles = async (option: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(option);

  const andCondition: Prisma.FileWhereInput[] = [];

  const files = await prisma.file.findMany({
    skip: skip,
    take: limit,
  });

  const count = await prisma.file.count();

  const meta = {
    page,
    limit,
    total: count,
  };

  return { meta, data: files };
};

const deleteFile = async (id: string) => {
  const isExist = await prisma.file.findUnique({ where: { id } });

  if (!isExist) throw new ApiError(httpStatus.BAD_REQUEST, "file not found");

  await deleteFromDigitalOceanAWS(isExist.url);

  await prisma.file.delete({ where: { id } });
};

const getFile = async (id: string) => {
  const isExist = await prisma.file.findUnique({ where: { id } });

  if (!isExist) throw new ApiError(httpStatus.BAD_REQUEST, "file not found");

  await deleteFromDigitalOceanAWS(isExist.url);

  return isExist;
};

const updateFile = async (
  id: string,
  files?: any[],
  payload?: Partial<File>
) => {
  const isExist = await prisma.file.findUnique({ where: { id } });

  if (!isExist) throw new ApiError(httpStatus.BAD_REQUEST, "file not found");

  let newUrl;
  if (files && Object.keys(files).length > 0) {
    console.log("fiel", files);
    const urls = await uploadFilesToDigitalOcean(files);
    newUrl = urls[0];
  }

  if (newUrl) {
    await deleteFromDigitalOceanAWS(isExist.url);
  }

  const updatedFile = await prisma.file.update({
    where: {
      id,
    },
    data: {
      ...payload,
      url: newUrl || isExist.url,
    },
  });

  return updatedFile;
};

export const uploadFileService = {
  createFile,
  getAllFiles,
  deleteFile,
  getFile,
  updateFile,
};
