import { insforgeClient } from "@/services/insforgeClient";

const CATEGORY_IMAGE_BUCKET = "kapxr-assets";

export type CategoryImageUploadResult = {
  imageUrl: string;
  imageObjectKey: string;
  imageBucketName: string;
};

export const uploadCategoryImage = async (
  file: File
): Promise<CategoryImageUploadResult> => {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const objectKey = `categories/images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await insforgeClient.storage
    .from(CATEGORY_IMAGE_BUCKET)
    .upload(objectKey, file);

  if (error || !data?.url || !data?.key) {
    throw new Error(error?.message || "Failed to upload category image");
  }

  return {
    imageUrl: data.url,
    imageObjectKey: data.key,
    imageBucketName: data.bucket || CATEGORY_IMAGE_BUCKET,
  };
};

