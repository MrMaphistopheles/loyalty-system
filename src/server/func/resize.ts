import sharp from "sharp";
import { uploadImage } from "@/server/func/uploadImage";

export default async function Resize(base64: string, name: string) {
  const parts = base64.split(";");
  const mimType = parts[0]?.split(":")[1];
  const imageData = parts[1]?.split(",")[1];

  const sizes = [96, 192, 512];

  let isError = false;
  let error = "";

  if (!imageData) {
    isError = true;
    error = "image data don't exist";
    return { isError, error };
  }
  const img = new Buffer(imageData, "base64");

  try {
    const getPath = (x: number) => {
      return new Promise<string>((resolve) => {
        sharp(img)
          .resize(x, x)
          .toBuffer()
          .then(async (resizedBuffer) => {
            const resizedData = resizedBuffer.toString("base64");
            const resizedBase64 = `data:${mimType};base64,${resizedData}`;

            const path = await uploadImage(resizedBase64, name);
            resolve(path);
          });
      });
    };

    const paths = sizes.map(async (i) => {
      return await getPath(i);
    });

    const data = await Promise.all(paths);
    console.log(data);

    return { data, isError, error };
  } catch (error) {
    isError = true;
    return { isError, error };
  }
}
