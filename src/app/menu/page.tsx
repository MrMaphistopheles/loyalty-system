"use client";
import { useEffect, useState } from "react";
import Layout from "../_components/app/Layout";
import { Avatar } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { type Dishes } from "../../server/api/routers/user";

const arr = [
  { item: "tea" },
  { item: "tea" },
  { item: "coffee" },
  { item: "tea" },
  { item: "tea" },
  { item: "tea" },
  { item: "coffee" },
  { item: "tea" },
  { item: "tea" },
  { item: "tea" },
  { item: "coffee" },
  { item: "tea" },
  { item: "tea" },
  { item: "tea" },
  { item: "coffee" },
  { item: "tea" },
  { item: "tea" },
  { item: "tea" },
  { item: "coffee" },
  { item: "tea" },
];

export default function Menu() {
  const [selected, setSelected] = useState("");
  const [isSelectedDish, setIsSelectedDish] = useState<string[]>([]);

  const searchPram = useSearchParams();
  const id = searchPram.get("id") || "";

  const { data, isSuccess } = api.user.getCategorys.useQuery({ id: id });

  const { data: dishData, isSuccess: dishSuccess } =
    api.user.getDishes.useQuery({
      id: selected,
    });

  useEffect(() => {
    if (data && data.categorys[0] !== undefined) {
      setSelected(data?.categorys[0]?.id);
    }
  }, [isSuccess]);

  const handleSelect = (id: string) => {
    if (!isSelectedDish.includes(id)) {
      setIsSelectedDish((prev) => [...prev, id]);
    } else {
      const arr = isSelectedDish.filter((i) => i !== id);
      setIsSelectedDish(arr);
    }
  };

  return (
    <Layout isVisible={false}>
      <div className="w-full py-8 dark:text-white">
        <div className="flex items-center justify-center gap-6">
          <Breadcrumbs>
            {data?.categorys.map((i, index) => (
              <BrItems
                key={index}
                item={i.name}
                isVisble={index === data.categorys.length - 1 ? false : true}
                isSelected={selected === i.id ? true : false}
                onClick={() => setSelected(i.id)}
              />
            ))}
          </Breadcrumbs>
          <div>
            <Heart />
          </div>
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-start gap-2 overflow-x-scroll px-2 pb-6">
        {dishData &&
          dishData.map((i, index) => (
            <div
              className="glass-sm-sh flex w-full items-center justify-between rounded-lg p-3"
              key={index}
            >
              <div className="flex items-center justify-center gap-4">
                <Avatar size="sm" src={i.image} />
                <h1>{i.name}</h1>
              </div>
              <Heart
                isSelected={isSelectedDish.includes(i.id) ? true : false}
                onClick={() => handleSelect(i.id)}
              />
            </div>
          ))}
      </div>
    </Layout>
  );
}

function Breadcrumbs({ children }: { children?: React.ReactNode }) {
  return (
    <div className=" hide-scroll flex gap-2 overflow-x-scroll px-3 py-2">
      {children}
    </div>
  );
}

function BrItems({
  item,
  isVisble,
  isSelected,
  onClick,
}: {
  item?: string | number;
  isVisble?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const defaultColor = "color-greay dark:color-of-spesial-black";

  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className={
          isSelected === true ? "text-black dark:text-white" : defaultColor
        }
        onClick={onClick}
      >
        {item}
      </span>
      {isVisble === false ? null : (
        <div>
          <svg
            className={`h-3 w-3 ${
              isSelected === true ? "text-black dark:text-white" : defaultColor
            } `}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 8 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function Heart({
  onClick,
  isSelected,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  return (
    <svg
      onClick={onClick}
      className={`h-6 w-6  ${
        isSelected === true ? "warm-color" : "text-black dark:text-white"
      }`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 18"
    >
      <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
    </svg>
  );
}
