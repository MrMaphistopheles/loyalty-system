"use client";
import { Button, CircularProgress, ScrollShadow } from "@nextui-org/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";

const items = [...Array(6).keys()].slice(1);

export default function Rating() {
  const [val, setVal] = useState(0);
  const { data, isSuccess } = api.waiter.getRating.useQuery();

  useEffect(() => {
    if (data && data.persenteg) {
      setVal(data.persenteg);
    }
  }, [isSuccess]);

  return (
    <>
      <div className="glass flex w-full items-start justify-center gap-2 rounded-xl py-3">
        <div className="flex gap-1 py-1">
          {items.map((i) => (
            <div key={i}>
              <svg
                className={`h-12 w-12 ${
                  data && Math.round(parseFloat(data.value)) >= i
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
        <div className="hide-scroll flex h-[20em] w-full flex-col items-center justify-start gap-2 overflow-x-auto">
          <AccorditionWithInfiniteScroll />
        </div>
      </ScrollShadow>
    </>
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

function AccorditionWithInfiniteScroll() {
  const [isOpen, setIsOpen] = useState<string>();
  const [page, setPage] = useState(0);

  const { isLoading, isError, data, fetchNextPage, isMore } =
    useGetRating(page);

  const nextPage = () => {
    void fetchNextPage();
    setPage((prev) => prev + 1);
  };

  return (
    <div className="flex w-full flex-col">
      {data?.map((i) => {
        return (
          <div
            key={i.id}
            className="flex w-full flex-col items-center justify-center"
            style={{
              transition:
                "opacity .5s, font-size .5s .5s, margin .5s .25s, padding .5s .25s",
            }}
          >
            <div
              className="flex h-14 w-full items-center justify-between px-2"
              onClick={() => {
                if (isOpen === i.id) setIsOpen("");
                if (isOpen !== i.id) setIsOpen(i.id);
              }}
            >
              <Stars count={i.stars} />
              <div
                style={{
                  transform: `rotate(${isOpen === i.id ? -90 : 0}deg)`,
                  transition: `0.3s ease-in-out`,
                }}
              >
                <svg
                  className="h-6 w-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m15 19-7-7 7-7"
                  />
                </svg>
              </div>
            </div>
            {isOpen === i.id ? (
              <motion.div
                className="flex w-full items-start px-2 py-3"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span>{i.desc}</span>
              </motion.div>
            ) : null}
          </div>
        );
      })}
      {isMore ? (
        <div
          onClick={nextPage}
          className="border-t-1 mt-3 flex w-full items-center justify-center border-black py-3 dark:border-white"
          style={{
            opacity: isMore ? 1 : 0,
            transition: "all .3s ease-in-out",
          }}
        >
          <p> Load more</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="border-t-1 mt-3 flex w-full items-center justify-center border-black py-3 dark:border-white">
          <p> Loading...</p>
        </div>
      ) : null}
      {isError ? (
        <div className="border-t-1 mt-3 flex w-full items-center justify-center border-black py-3 dark:border-white ">
          <p>Server Error! Try refrech page.</p>
        </div>
      ) : null}
    </div>
  );
}

function useGetRating(page: number) {
  const {
    data: rate,
    isSuccess,
    isLoading,
    isError,
    fetchNextPage,
  } = api.waiter.getRatingDescription.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const [data, setData] = useState<
    {
      id: string;
      stars: number;
      desc: string;
    }[]
  >([]);
  const [isMore, setIsMore] = useState(true);

  useEffect(() => {
    setData((prevRate) => {
      const filteredItems = rate?.pages[page]?.items.filter(
        (i) => i.stars !== 0,
      );

      if (filteredItems) {
        return [...new Set([...prevRate, ...filteredItems])];
      }
      return prevRate;
    });
  }, [page, rate]);

  const hasMore = rate?.pages[page]?.hasMore;

  useEffect(() => {
    if (hasMore !== undefined) {
      setIsMore(hasMore);
    }
  }, [hasMore]);

  return { fetchNextPage, isLoading, isError, data, isMore };
}
