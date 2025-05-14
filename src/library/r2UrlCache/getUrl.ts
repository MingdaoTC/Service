import {
  ensureR2CacheTtlIndex,
  addPresignedUrlToCache,
  getPresignedUrlFromCache,
} from "../prisma/r2PresignedUrl";

import { R2_CACHE_TTL_SECONDS } from "../prisma/r2PresignedUrl/type";

import { getDownloadPresignedUrl } from "./presign";

export async function getUrlByObjectKey(objectKey: string) {
  ensureR2CacheTtlIndex();

  const cachedUrlDoc = await getPresignedUrlFromCache(objectKey);

  if (cachedUrlDoc) {
    return cachedUrlDoc.presignedUrl;
  }

  const newPresignedUrl = await getDownloadPresignedUrl(
    objectKey,
    R2_CACHE_TTL_SECONDS,
  );

  if (newPresignedUrl) {
    await addPresignedUrlToCache(objectKey, newPresignedUrl);
    return newPresignedUrl;
  }

  return null; // 無法生成 URL
}
