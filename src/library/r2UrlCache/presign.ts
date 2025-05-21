import { r2 } from "@/library/r2/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getDownloadPresignedUrl(
  key: string,
  expiresIn: number = 3600,
  bucketName?: string,
): Promise<string> {
  const bucket = bucketName || process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

  if (!bucket) {
    throw new Error(
      "bucketName is undefined or NEXT_PUBLIC_S3_BUCKET_NAME is not defined",
    );
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(r2, command, { expiresIn });
}
