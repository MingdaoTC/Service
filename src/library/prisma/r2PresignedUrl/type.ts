import { ObjectId } from "mongodb";
export interface R2PresignedUrlCacheDocument {
  _id?: ObjectId;
  objectKey: string;
  presignedUrl: string;
  createdAt: Date;
}

export const R2_CACHE_COLLECTION_NAME = "R2PresignedUrlCache";

export const R2_CACHE_TTL_SECONDS = 3 * 60;
