import { upload } from "../upload";

export async function uploadAvatar(file: File) {
  try {
    const response = await upload(
      file,
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      "avatar/" + file.name,
    );
  } catch (error) {
    throw new Error("Failed to upload avatar");
  }
}
