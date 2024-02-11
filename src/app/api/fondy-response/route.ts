import { db } from "@/server/db";
import { NextRequest } from "next/server";
import { getServerAuthSession } from "../../../server/auth";

export async function POST(req: NextRequest) {
  console.log(req);

  //const body = await req.json();

  return Response.redirect("https://lite-theta.vercel.app");
}
