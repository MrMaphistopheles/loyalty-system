"use client";

import { useSearchParams } from "next/navigation";

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
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";
import Authoraised from "@/app/_components/app/Authoraised";

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

  const { mutate: mutateP, isLoading: isLoadingUpdateP } =
    api.manager.updateDishWithPhoto.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  const [price, setPrice] = useState<number>(0);
  const [triger, setTriger] = useState(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (data && data) {
      setName(data.name ?? ""),
        setDescription(data.description ?? ""),
        setPrice(data.price ?? 0);
      setTriger(data.price ?? 0);
      if (data.images && data.images[0]?.path !== undefined) {
        setImage(data.images[0]?.path);
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (document) {
      const heigth = document.body.clientHeight;
    }
  }, []);

  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["jpeg", "png"]),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
      new ImageDimensionsValidator({
        maxHeight: 999, // in pixels
        maxWidth: 2600,
      }),
    ],
  });

  useEffect(() => {
    if (filesContent[0]?.content !== undefined) {
      setImage(filesContent[0].content);
    }
  }, [filesContent]);

  const handleClickUpdate = () => {
    if (image.length > 1) {
      console.log("phote");

      mutateP({
        id: id ?? "",
        name: name,
        description: description,
        price: price,
        image: image,
        imageName: filesContent[0]?.name ?? "",
      });
    } else {
      mutate({
        id: id ?? "",
        name: name,
        description: description,
        price: price,
      });
    }
  };

  return (
    <Authoraised role="MANAGER" main={true}>
      {image.length > 0 ? (
        <Image
          onClick={openFilePicker}
          src={image}
          alt="Dish Image"
          className="max-h-[15em] max-w-[22rem]"
        />
      ) : (
        <div
          className="glass-sm-sh flex h-[15em] w-full flex-col items-center justify-center rounded-3xl"
          onClick={openFilePicker}
        >
          <svg
            className="h-28 w-28 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z" />
          </svg>
        </div>
      )}

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
            size="sm"
            disableAnimation
            disableAutosize
            classNames={{
              base: "w-full",
              input: "resize-y min-h-[20px]",
            }}
            defaultValue={data?.description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          ></Textarea>
        </div>
      )}

      <Button
        size="lg"
        isLoading={isLoadingUpdate || isLoadingUpdateP}
        onClick={handleClickUpdate}
        className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
      >
        {isLoading ? (
          "Loading..."
        ) : (
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
        )}
      </Button>
    </Authoraised>
  );
}

function Loading() {
  return (
    <div className="glass flex w-full flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4">
      <Skeleton className="w-full rounded-lg">
        <div className="bg-default-200 h-12 w-3/5 rounded-lg"></div>
      </Skeleton>

      <Skeleton className="w-full rounded-lg">
        <div className="bg-default-300 h-12 w-2/5 rounded-lg"></div>
      </Skeleton>
      <Skeleton className=" w-full rounded-lg">
        <div className="bg-default-300 h-28 rounded-lg"></div>
      </Skeleton>
    </div>
  );
}
