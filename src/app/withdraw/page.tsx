"use client";
import { Button, Checkbox, Input } from "@nextui-org/react";
import Layout from "../_components/app/Layout";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function WithDraw() {
  const [inputValue, setInputValue] = useState("0000 0000 0000 0000");
  const [isApproved, setApproved] = useState(false);

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

  const { data, isLoading } = api.waiter.getTips.useQuery();

  return (
    <Layout gap={4}>
      <div className="glass flex h-[15em] w-full flex-col items-center justify-start rounded-lg text-black dark:text-white">
        <div className="h-[3em] w-full rounded-t-lg bg-indigo-700" />
        <div className="flex h-[12em] w-full flex-col items-start justify-center gap-2 p-4">
          <p className="text-sm">Номер карти</p>

          <input
            type="text"
            id="inputField"
            value={inputValue}
            onChange={handleInputChange}
            className="min-w-0 bg-transparent text-xl  focus:placeholder-transparent focus:outline-none"
          />

          <p className="text-sm">Сума</p>
          <p className="text-lg font-bold ">{data && data.balance / 100} ₴</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-start px-4">
        <Checkbox color="secondary" onValueChange={(val) => setApproved(val)} />
        <p>Реквізити вказані мною вірні!</p>
      </div>
      <Button
        size="lg"
        isDisabled={isApproved === false ? true : false}
        className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
      >
        Вивести
      </Button>
    </Layout>
  );
}
