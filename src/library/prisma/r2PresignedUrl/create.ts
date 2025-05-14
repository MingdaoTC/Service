import { prisma } from "@/library/prisma";
import {
  R2PresignedUrlCacheDocument,
  R2_CACHE_COLLECTION_NAME,
  R2_CACHE_TTL_SECONDS,
} from "./type";
import { ObjectId as MongoObjectId } from "mongodb";

// Ensure TTL index
export async function ensureR2CacheTtlIndex(): Promise<void> {
  try {
    await prisma.$runCommandRaw({
      createIndexes: R2_CACHE_COLLECTION_NAME,
      indexes: [
        {
          key: { createdAt: 1 },
          name: "createdAt_ttl_index",
          expireAfterSeconds: R2_CACHE_TTL_SECONDS - 5 * 60,
        },
      ],
    });
  } catch (error: any) {
    if (
      error?.codeName === "IndexOptionsConflict" ||
      error?.codeName === "IndexKeySpecsConflict" ||
      error?.message?.includes("already exists")
    ) {
      console.warn(
        `TTL index for '${R2_CACHE_COLLECTION_NAME}' already exists or conflicts with existing options:`,
        error.message || error,
      );
    } else {
      console.error(
        `Unexpected error creating TTL index for '${R2_CACHE_COLLECTION_NAME}':`,
        error,
      );
      throw error;
    }
  }
}

export async function addPresignedUrlToCache(
  objectKey: string,
  presignedUrl: string,
): Promise<R2PresignedUrlCacheDocument | null> {
  const documentToInsert: Omit<
    R2PresignedUrlCacheDocument,
    "_id" | "createdAt"
  > & { createdAt: Date } = {
    objectKey,
    presignedUrl,
    createdAt: new Date(),
  };

  try {
    const result = await prisma.$runCommandRaw({
      insert: R2_CACHE_COLLECTION_NAME,
      documents: [documentToInsert],
    });

    // @ts-ignore: $runCommandRaw returns any, we expect a specific structure for insert
    if (result.ok && result.n === 1 && result.writeErrors === undefined) {
      return {
        ...documentToInsert,
      } as R2PresignedUrlCacheDocument; // Cast, _id will be undefined
    } else {
      // @ts-ignore
      console.error(
        "Failed to insert presigned URL into cache:",
        result.writeErrors || result.errmsg,
      );
      return null;
    }
  } catch (error) {
    console.error("Error inserting presigned URL into cache:", error);
    return null;
  }
}

export async function getPresignedUrlFromCache(
  objectKey: string,
): Promise<R2PresignedUrlCacheDocument | null> {
  try {
    const commandResult = await prisma.$runCommandRaw({
      find: R2_CACHE_COLLECTION_NAME,
      filter: { objectKey: objectKey },
      limit: 1,
    });

    const cursor = commandResult.cursor;
    if (cursor && (cursor as any).firstBatch?.length > 0) {
      // @ts-ignore
      const doc = cursor.firstBatch[0];

      return {
        _id: doc._id as MongoObjectId,
        objectKey: doc.objectKey as string,
        presignedUrl: doc.presignedUrl as string,
        createdAt: new Date(doc.createdAt),
      } as R2PresignedUrlCacheDocument;
    }
    return null; // not found
  } catch (error) {
    console.error("Error fetching presigned URL from cache:", error);
    return null;
  }
}
