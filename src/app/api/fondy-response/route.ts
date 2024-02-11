import { db } from "@/server/db";
import { getServerAuthSession } from "../../../server/auth";

export async function POST(req: Request) {
  return Response.json(req);
}
