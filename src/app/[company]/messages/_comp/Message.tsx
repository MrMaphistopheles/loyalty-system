import { Avatar, Button, ScrollShadow } from "@nextui-org/react";
import React from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

export default function Message({ company }: { company: string }) {
  const { data: idata } = api.user.getRatesInfo.useQuery();
  const data = [...(idata ?? [])].reverse();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 dark:text-white">
      <ScrollShadow className="w-full">
        <div className="flex h-[90dvh] w-full flex-col items-center justify-start gap-2 overflow-x-auto bg-transparent px-6 py-8">
          {data &&
            data.map((i) => (
              <React.Fragment key={i?.id}>
                <Link href={`/${company}/rate?id=${i?.id}`} className="w-full">
                  <div className="glass flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3">
                    <div className="flex w-full items-center justify-start gap-3">
                      <Avatar size="md" src={i?.image ? i?.image : ""} />
                      <h1>{i?.name}</h1>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        isIconOnly
                        size="sm"
                        className="bg-black dark:bg-white"
                      >
                        <svg
                          className="h-4 w-4 text-white dark:text-black"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 18"
                        >
                          <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Link>
              </React.Fragment>
            ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
