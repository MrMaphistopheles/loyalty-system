"use client";

import { useSearchParams } from "next/navigation";
import Layout from "../_components/app/Layout";
import { api } from "@/trpc/react";
import { Avatar, Textarea } from "@nextui-org/react";
import { useState } from "react";
const items = [...Array(6).keys()].slice(1);

export default function Rate() {
  const searchPram = useSearchParams();
  const id = searchPram.get("id") ?? "";
  const [show, setShow] = useState(0);

  const { data } = api.user.getRateInfo.useQuery({ id: id });

  return (
    <Layout isVisible={false} gap={3}>
      {data &&
        data.map((i) => (
          <>
            <Avatar src={i?.image ?? ""} className="h-28 w-28" />
            <h1>{i.name}</h1>
            <div className="flex gap-1">
              {items.map((i) => (
                <div key={i} onClick={() => setShow(i)}>
                  <svg
                    className={`h-9 w-9 ${
                      show >= i ? "text-yellow-400" : "text-white"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </div>
              ))}
            </div>
            <Textarea variant="bordered"></Textarea>
          </>
        ))}
    </Layout>
  );
}
