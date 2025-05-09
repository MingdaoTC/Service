import { upload } from "../upload";

export async function uploadAvatar(file: File) {
  try {
    const _response = await upload(
      file,
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME ??
        (() => {
          throw new Error("NEXT_PUBLIC_S3_BUCKET_NAME is not defined");
        })(),
      `avatar/${file.name}`,
    );
  } catch (_error) {
    throw new Error("Failed to upload avatar");
  }
}
