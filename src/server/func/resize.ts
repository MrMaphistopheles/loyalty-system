import { googleBucket } from "@/server/func/uploadImage";
import Jimp from "jimp";

export async function Resize(base64: string, name: string) {
  const sizes = [96, 192, 512];

  try {
    const parts = base64.split(";");
    const mimType = parts[0]?.split(":")[1];
    const imageData = parts[1]?.split(",")[1];

    if (!imageData)
      return { data: null, isError: true, error: "image data don't exist" };

    const img = Buffer.from(imageData, "base64");

    const path = async (x: number, buffer: Buffer) => {
      const res = await Jimp.read(buffer);
      if (!mimType) throw new Error("NO MimType");
      const resB = await res.resize(x, x).getBase64Async(mimType);

      const upload = await googleBucket(name, resB);
      const path = await upload.uploadImageToBucket();
      if (path) return path;
    };

    const data = await Promise.all(
      sizes.map(async (i) => {
        const pathA = await path(i, img);
        if (typeof pathA === "string") return pathA;
      }),
    );

    return { data, isError: false, error: "" };
  } catch (error) {
    return { data: null, isError: true, error };
  }
}
