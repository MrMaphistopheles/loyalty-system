import { db } from "@/server/db";
import { getServerAuthSession } from "../../../server/auth";

export async function POST(req: Request) {
  const res = await req.json();
  return Response.json({ res });
}
