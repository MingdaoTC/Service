import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./client";

export async function upload(
  file: File | Blob,
  key: string,
  ContentType: string,
) {
  // 转换文件为 ArrayBuffer
  let buffer: ArrayBuffer;

  if (file instanceof File || file instanceof Blob) {
    buffer = await file.arrayBuffer();
  } else {
    throw new Error("Invalid file format");
  }

  // 创建 Uint8Array 从 ArrayBuffer
  const uint8Array = new Uint8Array(buffer);

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: key,
    Body: uint8Array,
    ContentType: ContentType,
  };

  try {
    return await r2.send(new PutObjectCommand(params));
  } catch (error) {
    console.error("R2 upload error:", error);
    throw error;
  }
}
