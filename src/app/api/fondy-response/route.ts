import { db } from "@/server/db";
import { getServerAuthSession } from "../../../server/auth";

export async function POST(req: Request) {
  const body = await req.json();

  console.log(body);

  return Response.redirect("https://lite-theta.vercel.app");
}
