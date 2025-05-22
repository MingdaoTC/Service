import { S3Client } from "@aws-sdk/client-s3";

//@ts-ignore
export const storage = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});
