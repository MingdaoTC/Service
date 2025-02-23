import { PutObjectCommand } from "@aws-sdk/client-s3";

import { r2 } from "./client";

export function upload(file: File, bucket: string, key: string) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file,
  };
  return r2.send(new PutObjectCommand(params));
}
