"use client";

import { useSearchParams } from "next/navigation";
import Layout from "../_components/app/Layout";
import {
  Button,
  Image,
  Input,
  Skeleton,
  Slider,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export default function EditDish() {
  const searchPram = useSearchParams();
  const id = searchPram.get("id");

  const { data, isLoading, isError, isSuccess, refetch } =
    api.manager.getDish.useQuery({
      id: id ?? "",
    });

  const { mutate, isLoading: isLoadingUpdate } =
    api.manager.updateDish.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  const [price, setPrice] = useState<number>(0);
  const [triger, setTriger] = useState(0);
  const [width, setwidth] = useState(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();

  useEffect(() => {
    if (data && data) {
      setName(data.name),
        setDescription(data.description ?? ""),
        setPrice(data.price ?? 0);
      setTriger(data.price ?? 0);
    }
  }, [data]);


  useEffect(() => {
    if (document) {
      const width = document.body.clientWidth;
      setwidth(width);
    }
  }, []);

  console.log(price);

  return (
    <Layout gap={3}>
      <Image
        src={
          data && data.images.length !== 0
            ? data.images[0]?.path
            : "https://media.cnn.com/api/v1/images/stellar/prod/220526171611-11-classic-french-dishes-ratatouille.jpg?c=original"
        }
        alt="Dish Image"
        width={width}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="glass flex w-full flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4">
          <Input
            key={triger}
            variant="bordered"
            label="Ціна"
            type="number"
            defaultValue={price.toString()}
            size="sm"
            onChange={(e) => {
              const val =
                e.target.value.length > 0 ? parseInt(e.target.value) : 0;
              setPrice(val);
            }}
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-small text-default-400">₴</span>
              </div>
            }
          />

          <Slider
            aria-label="Select a value"
            color="foreground"
            size="sm"
            step={1}
            value={!Number.isNaN(price) ? price : 0}
            maxValue={price > 3000 ? 10000 : 3000}
            className="max-w-md"
            onChange={(v) => {
              const val: number = v as number;
              setPrice(val);
              setTriger(val);
            }}
          />
          <Input
            variant="bordered"
            label="Назва"
            defaultValue={data?.name ?? ""}
            size="sm"
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            variant="bordered"
            label="Опис"
            size="lg"
            defaultValue={data?.description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          ></Textarea>
        </div>
      )}

      <Button
        size="lg"
        isLoading={isLoadingUpdate}
        onClick={() =>
          mutate({
            id: id ?? "",
            name: name,
            description: description,
            price: price,
          })
        }
        className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
      >
        {
          <>
            <svg
              className="h-6 w-6 text-white dark:text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z" />
              <path d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
            Update
          </>
        }
      </Button>
    </Layout>
  );
}

function Loading() {
  return (
    <div className="glass flex w-full flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4">
      <Skeleton className="w-full rounded-lg">
        <div className="h-12 w-3/5 rounded-lg bg-default-200"></div>
      </Skeleton>

      <Skeleton className="w-full rounded-lg">
        <div className="h-12 w-2/5 rounded-lg bg-default-300"></div>
      </Skeleton>
      <Skeleton className=" w-full rounded-lg">
        <div className="h-28 rounded-lg bg-default-300"></div>
      </Skeleton>
    </div>
  );
}
