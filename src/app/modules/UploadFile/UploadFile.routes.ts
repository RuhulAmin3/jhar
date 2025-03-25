import express, { NextFunction, Request, Response } from "express";
import { UploadFileController } from "./UploadFile.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  fileUploader.uploadImageAndFile,
  (req: Request, res: Response, next: NextFunction) => {
    const parseData = JSON.parse(req.body.data || "{}");
    req.body = parseData;
    return UploadFileController.createFile(req, res, next);
  },
  UploadFileController.createFile
);

router.get("/", UploadFileController.getAllFiles);

router.get("/:id", UploadFileController.getFile);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  fileUploader.uploadImageAndFile,
  (req: Request, res: Response, next: NextFunction) => {
    const parseData = JSON.parse(req.body.data || "{}");
    req.body = parseData;
    return UploadFileController.updateFile(req, res, next);
  },
  UploadFileController.updateFile
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.TUTOR, UserRole.STUDENT),
  UploadFileController.deleteFile
);

export const uploadFileRoute = router;
