"use client";

import { useSearchParams } from "next/navigation";
import Layout from "../_components/app/Layout";
import { api } from "@/trpc/react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Input,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
const items = [...Array(6).keys()].slice(1);

export default function Rate() {
  const searchPram = useSearchParams();
  const id = searchPram.get("id") ?? "";
  const [isTip, setIsTip] = useState(false);

  const [show, setShow] = useState(0);
  const [description, setDescription] = useState("");

  const { data, isSuccess } = api.user.getRateInfo.useQuery({
    id: id,
  });

  useEffect(() => {
    if (data && data[0]?.stars && data[0].description) {
      setShow(data[0].stars);
      setDescription(data[0].description);
    }
  }, [isSuccess]);

  const {
    mutate,
    isLoading,
    isSuccess: mSuccess,
  } = api.user.updateRate.useMutation({
    onSuccess: () => {
      setIsTip(true);
    },
  });

  return (
    <Layout isVisible={false} gap={8}>
      {data &&
        data.map((i) => (
          <React.Fragment key={i.id}>
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <Avatar src={i?.image ?? ""} className="h-28 w-28" />

              <h1 className="w-8/12 text-center text-lg">
                На скільки ви готові рекомендувати {i.name}?
              </h1>
            </div>
            <br />
            <div className="flex w-full flex-col items-center justify-center gap-8">
              <div className="flex gap-1">
                {items.map((i) => (
                  <div key={i} onClick={() => setShow(i)}>
                    <svg
                      className={`h-14 w-14 ${
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

              {isTip ? (
                <Tips
                  rateId={data[0]?.id}
                  customarId={data[0]?.customarId}
                  waiterId={data[0]?.waiterId}
                  waiterName={data[0]?.name}
                />
              ) : (
                <>
                  <Textarea
                    variant="bordered"
                    size="lg"
                    label="Відгук"
                    onChange={(e) => setDescription(e.target.value)}
                    defaultValue={data[0]?.description}
                    className="w-11/12"
                  ></Textarea>
                  <Button
                    isLoading={isLoading}
                    onClick={() =>
                      mutate({
                        id: i.id ?? "",
                        stars: show,
                        description: description,
                      })
                    }
                    size="lg"
                    className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
                  >
                    {isLoading ? "Loading..." : " Оцінити"}
                  </Button>
                </>
              )}
            </div>
          </React.Fragment>
        ))}
    </Layout>
  );
}

function Tips({
  rateId,
  customarId,
  waiterId,
  waiterName,
}: {
  rateId: string | undefined;
  customarId: string | undefined;
  waiterId: string | undefined | null;
  waiterName: string | undefined | null;
}) {
  const tipsAmount = [
    { option: 10, val: 1000, currency: "uah" },
    { option: 20, val: 2000, currency: "uah" },
    { option: 30, val: 3000, currency: "uah" },
  ];

  const router = useRouter();

  const [isSelect, setIsSelect] = useState<number | string>();
  const [sum, setSum] = useState<number>();
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    const amount = tipsAmount.filter((i) => i.option === isSelect);
    if (amount[0]) {
      setSum(amount[0]?.val);
      setCustom(false);
    }
  }, [isSelect]);

  const { mutate, isLoading, data, isSuccess } = api.user.payment.useMutation();

  useEffect(() => {
    if (data) {
      router.push(data?.redirectUrl);
    }
  }, [isSuccess]);

  const handleMutation = () => {
    if (rateId && waiterId && waiterName) {
      let amount = sum || 0;
      mutate({
        rateId: rateId,
        waiterId: waiterId,
        amount: amount,
        waiterName: waiterName,
      });
    }
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex w-full items-center justify-center gap-2">
        <div className="rounded-xl bg-white">
          <ButtonGroup size="md">
            {tipsAmount.map((i) => (
              <Button
                key={i.option}
                variant="solid"
                onClick={() => setIsSelect(i.option)}
                className={`h-[3.2rem] ${
                  isSelect === i.option
                    ? `bg-black text-white`
                    : `bg-white text-black`
                }`}
              >
                {i.option} {i.currency}
              </Button>
            ))}

            {custom ? (
              <>
                <input
                  id="custom"
                  placeholder="сума"
                  className="h-[2.5rem] w-[4.5rem] min-w-0 border-0 pl-3 focus:placeholder-transparent focus:outline-none"
                  type="number"
                  onChange={(e) => setSum(parseInt(e.target.value) * 100)}
                />
              </>
            ) : (
              <Button
                variant="solid"
                onClick={() => setCustom(true)}
                className="h-[3.2rem] bg-white text-black"
              >
                custom
              </Button>
            )}
          </ButtonGroup>
        </div>
      </div>
      <Button
        size="lg"
        className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
        isLoading={isLoading}
        onClick={handleMutation}
      >
        Надіслати
      </Button>
    </motion.div>
  );
}
