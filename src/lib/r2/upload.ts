import { PutObjectCommand } from "@aws-sdk/client-s3";

import { r2 } from "./client";

export async function upload(file: File, bucket: string, key: string) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file,
  };
  try {
    const response = await r2.send(new PutObjectCommand(params));
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
