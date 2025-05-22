import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { storage } from "./client";

export async function getDownloadPresignedUrl(
  key: string,
  expiresIn: number = 300,
): Promise<string> {
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_PRIVATE_NAME;

  if (!bucket) {
    throw new Error(
      "bucketName is undefined or NEXT_PUBLIC_S3_BUCKET_NAME is not defined",
    );
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(storage, command, { expiresIn });
}
