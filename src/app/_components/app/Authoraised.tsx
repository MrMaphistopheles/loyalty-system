"use client";
import { useSession } from "next-auth/react";
import { type UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Authoraised({
  children,
  role,
  company,
  main,
}: {
  children: React.ReactNode;
  role: UserRole;
  company?: string;
  main?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/signin");
    if (session && session.user.role !== role)
      router.push(main === true ? `/` : `/${company}`);
  }, [session]);

  if (session && session.user.role === role) return <>{children}</>;
}
