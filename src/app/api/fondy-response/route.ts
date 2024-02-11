import { db } from "@/server/db";
import { getServerAuthSession } from "../../../server/auth";

export async function POST(req: Request) {
  try {
    const res = await req.json();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
