"use client";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Authoraised({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) router.push("/signin");
  if (session?.user.role !== role) router.push("/");
  if (session && session.user.role === role) {
    return <>{children}</>;
  }
}
