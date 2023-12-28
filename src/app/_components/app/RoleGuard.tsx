"use client";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

export default function RoleGuard({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { data: session } = useSession();
  if (session && session.user.role === role) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        {children}
      </div>
    );
  }
}
