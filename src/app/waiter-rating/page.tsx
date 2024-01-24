"use client";
import {
  Accordion,
  AccordionItem,
  CircularProgress,
  ScrollShadow,
} from "@nextui-org/react";
import Layout from "../_components/app/Layout";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

const items = [...Array(6).keys()].slice(1);

export default function page() {
  const [val, setVal] = useState(91);

  const { data, isSuccess } = api.waiter.getRating.useQuery();
  useEffect(() => {
    if (data && data.persenteg) {
      setVal(data.persenteg);
    }
  }, [isSuccess]);

  const { data: rate } = api.waiter.getRatingDescription.useQuery();

  const defaultContent =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus fugit autem corporis vitae nam doloremque aut eius dignissimos quam maiores quaerat sed, amet qui aliquid ea vero dolorum adipisci in.";

  return (
    <Layout gap={4}>
      <div className="glass flex w-full items-start justify-center gap-2 rounded-xl py-3">
        <div className="flex gap-1 py-1">
          {items.map((i) => (
            <div key={i}>
              <svg
                className={`h-12 w-12 ${
                  data && parseInt(data.value) >= i
                    ? "text-yellow-400"
                    : "text-white"
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
        <p className="m-0 p-0 text-[150%] font-light">{data && data.value}</p>
      </div>
      <div className="glass flex w-full items-center justify-center rounded-xl py-8">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36",
            track: "stroke-transparent",
            value: "text-3xl font-semibold text-black dark:text-white",
          }}
          value={val}
          strokeWidth={4}
          showValueLabel={true}
          color={
            val <= 30
              ? "danger"
              : val <= 70
                ? "warning"
                : val <= 90
                  ? "primary"
                  : "success"
          }
        />
      </div>
      <ScrollShadow className="w-full">
        <div className="flex h-[20em] w-full flex-col items-center justify-start gap-2 overflow-x-auto bg-transparent">
          <Accordion>
            {rate !== undefined ? (
              rate.map((i) => (
                <AccordionItem
                  key={i.id}
                  aria-label={i.stars.toString()}
                  //title={i.stars.toString()}
                  startContent={<Stars count={i.stars} />}
                >
                  {i.desc}
                </AccordionItem>
              ))
            ) : (
              <AccordionItem key="1" aria-label="some" title="some">
                some
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </ScrollShadow>
    </Layout>
  );
}

function Stars({ count }: { count: number }) {
  const items = [...Array(count + 1).keys()].slice(1);
  return (
    <div className="flex gap-1 py-1">
      {items.map((i) => (
        <div key={i}>
          <svg
            className="h-8 w-8 text-black dark:text-white"
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
  );
}
