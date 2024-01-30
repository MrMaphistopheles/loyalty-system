"use client";
import { api } from "@/trpc/react";
import { ScrollShadow } from "@nextui-org/react";

export default function WithDrawRequest() {
  const { data, isLoading } = api.waiter.getWithDrawStatus.useQuery();

  return (
    <ScrollShadow className="w-full">
      <div className="flex h-[80dvh] w-full flex-col items-center justify-start gap-2 overflow-x-auto bg-transparent px-6 py-8">
        {data &&
          data.map((i) => (
            <div
              className="glass-sm-sh flex h-14 w-full items-center justify-between rounded-lg px-3"
              key={i.id}
            >
              <p>{i.amount / 100} ₴</p>
              <p
                style={
                  i.status === "processing"
                    ? { color: "#ffbb00" }
                    : i.status === "approved"
                      ? { color: "#10cf02" }
                      : {}
                }
              >
                <li>
                  {i.status === "processing"
                    ? "в опрацювані"
                    : i.status === "approved"
                      ? "готово"
                      : null}
                </li>
              </p>
            </div>
          ))}
      </div>
    </ScrollShadow>
  );
}
