import { db } from "@/server/db";
import { getServerAuthSession } from "../../../server/auth";

export async function POST(req: Request) {
  try {
    const res = await req.json();
    return Response.json({ res, req });
  } catch (error) {
    return Response.json({ error, req });
  }
}
