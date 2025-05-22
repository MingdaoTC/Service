import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { storage } from "./client";

interface DeleteOptions {
  bucketName?: string;
}

interface DeleteResponse {
  success: boolean;
  key?: string;
  rawResponse?: DeleteObjectCommandOutput;
  error?: string;
}

export async function deleteObject(
  key: string,
  options: DeleteOptions = {},
): Promise<DeleteResponse> {
  if (!key || typeof key !== "string") {
    return { success: false, error: "should provide a valid key" };
  }

  const bucketName =
    options.bucketName || process.env.NEXT_PUBLIC_S3_BUCKET_PUBLIC_NAME;
  if (!bucketName) {
    return {
      success: false,
      error:
        "bucketName is undefined or NEXT_PUBLIC_S3_BUCKET_NAME is not defined",
    };
  }

  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const response = await storage.send(new DeleteObjectCommand(params));

    return {
      success: true,
      key,
      rawResponse: response,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to delete from storage:", error);

    return {
      success: false,
      key,
      error: `Failed to delete from storage: ${errorMessage}`,
    };
  }
}
