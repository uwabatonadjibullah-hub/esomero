// src/services/r2Service.js

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// 🔐 Secure credentials via .env (make sure these are defined in .env.local)
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = import.meta.env.VITE_R2_ENDPOINT;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME || "handouts"; // fallback if not set

// 🎯 Create R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// 📤 Upload file
export const uploadToR2 = async (file, key) => {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: file.type || "application/octet-stream",
  });

  await r2Client.send(command);
  return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;
};

// 📥 Download file (returns stream — use with caution in browser)
export const getFromR2 = async (key) => {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await r2Client.send(command);
};

// 📃 List files in bucket
export const listR2Files = async () => {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
  });

  const response = await r2Client.send(command);
  return response.Contents || [];
};

// 🗑️ Delete file
export const deleteFromR2 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
};