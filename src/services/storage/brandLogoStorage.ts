import { insforgeClient } from "@/services/insforgeClient";

const BRAND_LOGO_BUCKET = "kapxr-assets";

export type BrandLogoUploadResult = {
  logoUrl: string;
  logoObjectKey: string;
  logoBucketName: string;
};

export const uploadBrandLogo = async (file: File): Promise<BrandLogoUploadResult> => {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const objectKey = `brands/logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await insforgeClient.storage.from(BRAND_LOGO_BUCKET).upload(objectKey, file);
  if (error || !data?.url || !data?.key) {
    throw new Error(error?.message || "Failed to upload brand logo");
  }
  return {
    logoUrl: data.url,
    logoObjectKey: data.key,
    logoBucketName: data.bucket || BRAND_LOGO_BUCKET,
  };
};
