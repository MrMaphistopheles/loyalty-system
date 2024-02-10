import { db } from "@/server/db";
import { NextRequest } from "next/server";
import { getServerAuthSession } from "../../../server/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);

  return Response.json({ body, msg: "working" });
}
