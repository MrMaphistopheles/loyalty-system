"use client";
import { Button, Checkbox, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Authoraised from "../_components/app/Authoraised";

export default function WithDraw() {
  const [inputValue, setInputValue] = useState("");
  const [isApproved, setApproved] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const textWithoutSpaces = inputText.replace(/\s/g, "");
    const arrs = textWithoutSpaces.match(/.{1,4}/g);

    if (!arrs) {
      setInputValue("");
    }

    if (arrs) {
      const textWithSpaces = arrs.join(" ");
      setInputValue(textWithSpaces);
    }
  };

  const { data, isLoading, isSuccess, refetch } = api.waiter.getTips.useQuery();

  useEffect(() => {
    if (isSuccess && data?.card) {
      setInputValue(data.card);
    }
  }, [isSuccess]);

  const { mutate, isLoading: MisLoading } =
    api.waiter.requestWithDraw.useMutation({
      onSuccess: () => {
        router.push("/withdraw-request");
      },
    });

  const { mutate: changeCardNum, isLoading: CisLoading } =
    api.waiter.changeCardNum.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  const handleCardNumChange = () => {
    if (inputValue === data?.card) return;
    if (inputValue.length === 19) {
      changeCardNum({
        cardNum: inputValue,
      });
    }
  };

  const handleMutation = () => {
    if (isApproved && data?.balance) {
      mutate({
        amount: data?.balance,
        accepted: isApproved,
      });
    } else {
      setMessage("На вашому рахунку не достатньо коштів для цеї операції!");
    }
  };

  return (
    <Authoraised role="WAITER">
      {message.length > 0 ? (
        <motion.div
          className="flex flex-col rounded-e-xl rounded-es-xl border-black bg-blue-500 p-4"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-lg font-normal text-white">{message}</p>
        </motion.div>
      ) : null}
      <div className="glass flex h-[15em] w-full flex-col items-center justify-start rounded-lg text-black dark:text-white">
        <div className="h-[3em] w-full rounded-t-lg bg-black dark:bg-white" />
        <div className="flex h-[12em] w-full flex-col items-start justify-center gap-2 p-4">
          <p className="text-sm">Номер карти</p>

          {isLoading || CisLoading ? (
            <Skeleton className="rounded-lg">
              <div className="h-10 w-56 rounded-lg bg-default-300"></div>
            </Skeleton>
          ) : (
            <input
              type="text"
              id="inputField"
              value={inputValue}
              maxLength={19}
              onBlur={handleCardNumChange}
              onChange={handleInputChange}
              className="min-w-0 bg-transparent text-xl  focus:placeholder-transparent focus:outline-none"
            />
          )}

          <p className="text-sm">Сума</p>
          {isLoading ? (
            <Skeleton className="rounded-lg">
              <div className="h-8 w-24 rounded-lg bg-default-300"></div>
            </Skeleton>
          ) : (
            <p className="text-lg font-bold ">{data && data.balance / 100} ₴</p>
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-start px-4">
        <Checkbox
          isSelected={isApproved}
          onValueChange={(val) => setApproved(val)}
        />
        <p
          onClick={() => {
            if (isApproved === false) setApproved(true);
            if (isApproved === true) setApproved(false);
          }}
        >
          Реквізити вказані мною вірні!
        </p>
      </div>
      <Button
        size="lg"
        isDisabled={isApproved === false ? true : false}
        className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
        isLoading={MisLoading}
        onClick={handleMutation}
      >
        {MisLoading ? "Loading..." : "Вивести"}
      </Button>
    </Authoraised>
  );
}
