import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { storage } from "./client";

interface UploadOptions {
  bucketName?: string;
  onProgress?: (progress: number) => void;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

interface UploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  rawResponse?: PutObjectCommandOutput;
  error?: string;
}

export async function upload(
  file: File | Blob,
  key: string,
  contentType: string,
  options: UploadOptions = {},
): Promise<UploadResponse> {
  if (!file) {
    return { success: false, error: "file is required" };
  }

  if (!key || typeof key !== "string") {
    return { success: false, error: "should provide a valid key" };
  }

  if (!contentType || typeof contentType !== "string") {
    return {
      success: false,
      error: "should provide a valid MIME content type",
    };
  }

  const bucketName =
    options.bucketName || process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  if (!bucketName) {
    return {
      success: false,
      error:
        "bucketName is undefined or NEXT_PUBLIC_S3_BUCKET_NAME is not defined",
    };
  }

  try {
    let buffer: ArrayBuffer;
    try {
      buffer = await file.arrayBuffer();
    } catch (e) {
      return {
        success: false,
        error: `Cannot read file: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }

    const uint8Array = new Uint8Array(buffer);

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: uint8Array,
      ContentType: contentType,
      Metadata: options.metadata,
      CacheControl: options.cacheControl,
    };

    for (const key of Object.keys(params) as Array<keyof typeof params>) {
      if (params[key] === undefined) {
        delete params[key];
      }
    }

    const response = await storage.send(new PutObjectCommand(params));

    const url = `https://${bucketName}.storage.cloudflarestorage.com/${key}`;

    return {
      success: true,
      key,
      url,
      rawResponse: response,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to upload to storage:", error);

    return {
      success: false,
      key,
      error: `Failed to upload to storage: ${errorMessage}`,
    };
  }
}
