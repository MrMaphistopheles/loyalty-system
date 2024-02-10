"use client";

import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";

import Authoraised from "@/app/_components/app/Authoraised";
import Rate from "./_comp/Rate";

export default function Page({ params }: { params: { company: string } }) {
  return (
    <Authoraised role="USER" company={params.company}>
      <Rate company={params.company} />
    </Authoraised>
  );
}
