import sharp from "sharp";
import { uploadImage } from "@/server/func/uploadImage";

export async function Resize(base64: string, name: string) {
  const sizes = [96, 192, 512];
  try {
    const parts = base64.split(";");
    const mimType = parts[0]?.split(":")[1];
    const imageData = parts[1]?.split(",")[1];

    if (!imageData)
      return { data: null, isError: true, error: "image data don't exist" };

    const img = new Buffer(imageData, "base64");

    const path = async (x: number) =>
      await sharp(img)
        .resize(x, x)
        .toBuffer()
        .then(async (resizedBuffer) => {
          const resizedData = resizedBuffer.toString("base64");
          const resizedBase64 = `data:${mimType};base64,${resizedData}`;
          return await uploadImage(resizedBase64, name);
        });

    const data = await Promise.all(
      sizes.map(async (i) => {
        return await path(i);
      }),
    );

    return { data, isError: false, error: "" };
  } catch (error) {
    return { data: null, isError: true, error };
  }
}
