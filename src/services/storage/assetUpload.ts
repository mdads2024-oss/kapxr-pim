import { insforgeClient } from "@/services/insforgeClient";

const ASSET_BUCKET = "kapxr-assets";

export type AssetUploadResult = {
  url: string;
  objectKey: string;
  bucketName: string;
};

export const uploadAssetFile = async (file: File): Promise<AssetUploadResult> => {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const objectKey = `assets/uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await insforgeClient.storage.from(ASSET_BUCKET).upload(objectKey, file);
  if (error || !data?.url || !data?.key) {
    throw new Error(error?.message || "Failed to upload asset");
  }

  return {
    url: data.url,
    objectKey: data.key,
    bucketName: data.bucket || ASSET_BUCKET,
  };
};

