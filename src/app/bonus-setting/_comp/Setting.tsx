"use client";
import { api } from "@/trpc/react";
import { Button, Input, Select, SelectItem, Skeleton } from "@nextui-org/react";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";

type Arr = {
  val: number;
  lable: string;
};

const arr = () => {
  const items = [...Array(101).keys()].splice(1);
  let arr: Arr[] = [];
  items.forEach((e) => {
    arr.push({
      val: e,
      lable: `Подарунок за ${e} покупку`,
    });
  });
  return arr;
};

export default function Setting() {
  const [items, setItems] = useState<Arr[]>();
  const [value, setValue] = useState<number>();
  const [edit, setEdit] = useState(false);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

  const { data, isLoading, isSuccess, refetch } =
    api.manager.getGiftOn.useQuery();

  // get path key

  const {
    data: pathData,
    isSuccess: pathIsSuccess,
    refetch: refetchPath,
  } = api.manager.getPathKey.useQuery();

  useEffect(() => {
    setEdit(false);
  }, [pathData]);

  useEffect(() => {
    if (data && data.gift) {
      const array: Arr[] = arr();
      setItems(array);
    }
  }, [isSuccess]);

  const { mutate, isLoading: upLoading } = api.manager.updateGift.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleMutation = () => {
    if (value && value) {
      mutate({
        select: value,
      });
    }
  };

  useEffect(() => {
    const cv = document.querySelector("canvas");
    setCanvas(cv);
  }, []);

  const handleSaveAsPNG = async (
    svgElement: HTMLCanvasElement | null | undefined,
  ) => {
    if (svgElement) {
      try {
        html2canvas(svgElement).then((canvas) => {
          const based64 = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = "image.png";
          link.href = based64;
          link.click();
        });
      } catch (error) {
        console.error("Error converting SVG to PNG:", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 dark:text-white">
        <div className="glass flex w-full flex-col items-center justify-center gap-2 rounded-2xl px-8  py-5">
          <h1 className="py-2 text-lg">Налаштування бонусної системи.</h1>
          {isSuccess && items !== undefined ? (
            <Select
              items={items}
              variant="bordered"
              className="w-full"
              size="md"
              defaultSelectedKeys={[`${data?.gift}`]}
              label="Select"
              onChange={(e) => setValue(parseInt(e.target.value))}
            >
              {(item) => (
                <SelectItem key={item.val} value={item.val}>
                  {item.lable}
                </SelectItem>
              )}
            </Select>
          ) : (
            <Skeleton className="blured w-full rounded-lg">
              <div className=" blured h-14 w-full rounded-lg"></div>
            </Skeleton>
          )}

          <Button
            size="lg"
            className="w-full bg-black text-white dark:bg-white dark:text-black"
            isLoading={upLoading}
            onClick={handleMutation}
          >
            {upLoading ? (
              "Loading..."
            ) : (
              <>
                <svg
                  className="h-6 w-6 text-white dark:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 21 16"
                >
                  <path d="M11 16a1 1 0 0 1-1-1v-1h2v1a1 1 0 0 1-1 1Z" />
                  <path d="M17.989 6.124a6.5 6.5 0 0 0-12.495-2.1A5 5 0 0 0 6 14h4V8.414l-.293.293a1 1 0 0 1-1.414-1.414l2-2a1 1 0 0 1 1.414 0l2 2a1 1 0 1 1-1.414 1.414L12 8.414V14h5a4 4 0 0 0 .989-7.876Z" />
                </svg>
                Вибрати
              </>
            )}
          </Button>
        </div>
        <div className="glass flex w-full flex-col items-center justify-center gap-2 rounded-2xl px-8  py-5">
          <h1 className="py-2 text-lg">Посилання для реєстрації клієнтів.</h1>
          {edit ? (
            <EditPathKey path={pathData?.path_key ?? ""} refech={refetchPath} />
          ) : (
            <Path onClick={() => setEdit(true)} path={pathData?.path_key} />
          )}

          <div className="my-2 rounded-lg bg-white p-3">
            <QRCodeCanvas
              value={`http://localhost:3000/${pathData?.path_key}` ?? ""}
            />
          </div>
          <Button
            size="lg"
            className="w-full bg-black text-white dark:bg-white dark:text-black"
            onClick={() => handleSaveAsPNG(canvas)}
          >
            <svg
              className="h-6 w-6 text-white  dark:text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
              <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
            Зберегти
          </Button>
        </div>
      </div>
    </>
  );
}

function EditPathKey({ path, refech }: { path: string; refech: () => void }) {
  const [input, setInput] = useState("");
  const { mutate, isLoading } = api.manager.editPathKey.useMutation({
    onSuccess: () => {
      void refech();
    },
  });
  const { mutate: createKey, isLoading: loadingKey } =
    api.manager.createPathKey.useMutation({
      onSuccess: () => {
        void refech();
      },
    });

  const handleMutation = () => {
    if (!path) createKey({ key: input });
    if (path) mutate({ key: input });
  };
  return (
    <div className="flex w-full items-center justify-normal gap-2">
      <Input
        size="sm"
        defaultValue={path}
        variant="bordered"
        className="dark:text-white"
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        isIconOnly
        className="bg-black dark:bg-white dark:text-black"
        size="lg"
        onClick={handleMutation}
        isLoading={isLoading || loadingKey}
      >
        <svg
          className="h-6 w-6 text-white dark:text-black"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 12"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5.917 5.724 10.5 15 1.5"
          />
        </svg>
      </Button>
    </div>
  );
}

function Path({
  onClick,
  path,
}: {
  onClick: () => void;
  path: string | undefined;
}) {
  const [copy, setCopy] = useState(false);
  const copyText = useRef<HTMLInputElement | null>(null);

  const setFalse = (ms: number) => {
    setTimeout(() => setCopy(false), ms);
  };

  const handleCopy = () => {
    if (copyText.current) {
      const val = copyText.current.select();
      document.execCommand("copy");
      setCopy(true);
      setFalse(1000);
    }
  };
  return (
    <div className="flex w-full items-center justify-normal gap-1">
      <Input
        size="sm"
        ref={copyText}
        value={!path ? "Створіть посилання" : `http://localhost:3000/${path}`}
        variant="bordered"
      />

      <Button isIconOnly className="bg-transparent" size="sm" onClick={onClick}>
        <svg
          className="h-6 w-6 text-black dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M11.3 6.2H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11c1.1 0 2-1 2-2.1V11l-4 4.2c-.3.3-.7.6-1.2.7l-2.7.6c-1.7.3-3.3-1.3-3-3.1l.6-2.9c.1-.5.4-1 .7-1.3l3-3.1Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M19.8 4.3a2.1 2.1 0 0 0-1-1.1 2 2 0 0 0-2.2.4l-.6.6 2.9 3 .5-.6a2.1 2.1 0 0 0 .6-1.5c0-.2 0-.5-.2-.8Zm-2.4 4.4-2.8-3-4.8 5-.1.3-.7 3c0 .3.3.7.6.6l2.7-.6.3-.1 4.7-5Z"
            clipRule="evenodd"
          />
        </svg>
      </Button>

      <Button
        isIconOnly
        className="bg-black dark:bg-white dark:text-black"
        size="lg"
        onClick={handleCopy}
      >
        {copy ? (
          <svg
            className="h-6 w-6 text-white dark:text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-white dark:text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="M5 9V4.13a2.96 2.96 0 0 0-1.293.749L.879 7.707A2.96 2.96 0 0 0 .13 9H5Zm11.066-9H9.829a2.98 2.98 0 0 0-2.122.879L7 1.584A.987.987 0 0 0 6.766 2h4.3A3.972 3.972 0 0 1 15 6v10h1.066A1.97 1.97 0 0 0 18 14V2a1.97 1.97 0 0 0-1.934-2Z" />
            <path d="M11.066 4H7v5a2 2 0 0 1-2 2H0v7a1.969 1.969 0 0 0 1.933 2h9.133A1.97 1.97 0 0 0 13 18V6a1.97 1.97 0 0 0-1.934-2Z" />
          </svg>
        )}
      </Button>
    </div>
  );
}
