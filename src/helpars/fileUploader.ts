import multer from "multer";
import path from "path";
import fs from "fs/promises";

import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Define the type for the file upload response from DigitalOcean Spaces
interface UploadResponse {
  Location: string; // This will store the formatted URL with "https://"
  Bucket: string;
  Key: string;
  ETag?: string;
}

// Configure DigitalOcean Spaces
const s3Client = new S3Client({
  region: "us-east-1", // Replace with your region if necessary
  endpoint: process.env.DO_SPACE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY || "",
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY || "",
  },
});

// Multer storage configuration (local storage before uploading to DigitalOcean)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },

  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Upload single video (expected field name 'video' in form-data)
const uploadSingle = upload.single("video");

const uploadImage = upload.single("image");

const uploadImageAndFile = upload.fields([
  { name: "video", maxCount: 30 },
  { name: "image", maxCount: 30 }, 
]);

// Upload file to DigitalOcean Spaces
const uploadToDigitalOcean = async (
  file: Express.Multer.File
): Promise<UploadResponse> => {
  if (!file) {
    throw new Error("File is required for uploading.");
  }

  try {
    // Ensure the file exists before attempting to upload it
    await fs.access(file.path);
    // Prepare file upload parameters
    const Key = `Jbarrezu/${Date.now()}_${file.filename}`;
    const uploadParams = {
      Bucket: process.env.DO_SPACE_BUCKET || "", // Replace with your DigitalOcean Space bucket name
      Key,
      Body: await fs.readFile(file.path),
      ACL: "public-read" as ObjectCannedACL, // Use ObjectCannedACL type explicitly
      ContentType: file.mimetype, // Ensure correct file type is sent
    };

    // Upload file to DigitalOcean Space
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Format the URL to include "https://"
    const fileURL = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${Key}`;

    fs.unlink(file.path);
    return {
      Location: fileURL,
      Bucket: process.env.DO_SPACE_BUCKET || "",
      Key,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFromDigitalOceanAWS = async (
  fileUrl: string
): Promise<void> => {
  try {
    // Extract the file key from the URL
    const key = fileUrl.replace(
      `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/`,
      ""
    );

    // Prepare the delete command
    const command = new DeleteObjectCommand({
      Bucket: `${process.env.DO_SPACE_BUCKET}`,
      Key: key,
    });

    // Execute the delete command
    await s3Client.send(command);

    console.log(`Successfully deleted file: ${fileUrl}`);
  } catch (error: any) {
    console.error(`Error deleting file: ${fileUrl}`, error);
    throw new Error(`Failed to delete file: ${error?.message}`);
  }
};

export const fileUploader = {
  uploadSingle,
  uploadImage,
  uploadToDigitalOcean,
  deleteFromDigitalOceanAWS,
  uploadImageAndFile,
};
