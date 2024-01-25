"use client";

import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { Loading } from "../_components/waiter/Scaner";
import { type Transaction } from "@prisma/client";
import { SvgBird } from "../_components/svg/SvgBird";

type TransactionObj = Omit<Transaction, "id">;
type TransactionModifiedObj = Omit<TransactionObj, "additional_info">;

type TransactionParams = Omit<
  TransactionModifiedObj,
  "response_signature_string"
> & {
  additional_info: string;
  response_signature_string: string;
};

export default function Fondy() {
  const searchPram = useSearchParams();

  let paramsObj: TransactionParams = {} as TransactionParams;

  for (const [key, value] of searchPram) {
    paramsObj[key as keyof TransactionParams] = value;
  }

  const { mutate, isSuccess } = api.user.updatePaymentDetails.useMutation();

  useEffect(() => {
    if (paramsObj) {
      mutate(paramsObj);
    }
  }, []);

  if (isSuccess) {
    return (
      <>
        <div className="w-2/3">
          <SvgBird />
        </div>
        <h1 className="text-2xl">Дякуємо за чайові!</h1>
      </>
    );
  }

  return (
    <>
      <Loading color="stroke-blue-500" />
    </>
  );
}
