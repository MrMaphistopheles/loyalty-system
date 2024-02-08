import { uploadImage } from "@/server/func/uploadImage";
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
      return await uploadImage(resB, name);
    };

    const data = await Promise.all(
      sizes.map(async (i) => {
        return await path(i, img);
      }),
    );

    return { data, isError: false, error: "" };
  } catch (error) {
    return { data: null, isError: true, error };
  }
}
