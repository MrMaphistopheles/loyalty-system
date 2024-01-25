"use client";
import { Avatar, Button, ScrollShadow } from "@nextui-org/react";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/trpc/react";
import Authoraised from "../_components/app/Authoraised";
import Link from "next/link";

export default function AddCard() {
  const [isRotated, setIsRotated] = useState<number>();

  const { data, isLoading, refetch } = api.user.getCompany.useQuery();

  const { mutate, isLoading: mLoading } = api.user.addPass.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const setRotated = (index: number) => {
    if (isRotated === index) {
      setIsRotated(undefined);
    } else {
      setIsRotated(index);
    }
  };

  return (
    <Authoraised role="USER">
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <ScrollShadow className="w-full">
          <div className="flex h-[75dvh] w-full flex-col items-center justify-start gap-2 overflow-x-auto bg-transparent px-6 py-8">
            {data &&
              data.map((i, index) => (
                <>
                  <div
                    key={index}
                    className="glass flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3"
                    onClick={() => setRotated(index)}
                  >
                    <div className="flex w-full items-center justify-start gap-3">
                      <Avatar
                        size="md"
                        src={i.image !== null ? i.image : undefined}
                      />
                      <h1>{i.name}</h1>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Arrow Deg={index === isRotated ? 90 : 0} />
                    </div>
                  </div>
                  {index === isRotated ? (
                    <motion.div
                      className="flex w-full items-center justify-center gap-2 px-4"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.9 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        size="lg"
                        className="w-1/3 bg-black text-white"
                        onClick={() => mutate({ id: i.id ?? "" })}
                        isLoading={mLoading}
                      >
                        Додати
                      </Button>
                      <Link
                        href={`/menu?id=${i.id}`}
                        className="flex h-12 w-2/3 items-center justify-center rounded-xl bg-white text-black"
                      >
                        Menu
                      </Link>
                    </motion.div>
                  ) : null}
                </>
              ))}
          </div>
        </ScrollShadow>
      </div>
    </Authoraised>
  );
}

function Arrow({ Deg }: { Deg?: number }) {
  let deg: number = Deg || 0;
  return (
    <div
      style={{
        transform: `rotate(${deg}deg)`,
        transition: `0.3s ease-in-out`,
      }}
    >
      <svg
        className="h-4 w-4 text-gray-800"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 8 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
        />
      </svg>
    </div>
  );
}
