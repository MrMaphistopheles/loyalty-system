"use client";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Menu() {
  const [name, setName] = useState("");
  const [heigth, setHeigth] = useState<number>();

  const {
    data,
    isLoading: categoryLoading,
    refetch,
  } = api.manager.getCategorys.useQuery();

  const { mutate, isLoading } = api.manager.addCategory.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  const { mutate: deleteM, isLoading: deleteL } =
    api.manager.deleteCategory.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  useEffect(() => {
    const heigth = document.body.offsetHeight;
    const h = Math.round((heigth / 100) * 70);
    setHeigth(h);
  }, []);
  console.log(heigth);

  return (
    <>
      <div
        className="flex w-full flex-col items-center justify-center gap-3 dark:text-white"
        style={{
          height: `${heigth}px`,
        }}
      >
        <div className=" hide-scroll flex w-full flex-col items-center justify-start gap-2 overflow-y-scroll px-2 pb-6">
          {data &&
            data.categorys.map((i) => (
              <div
                className="glass-sm-sh flex w-full items-center justify-between rounded-lg p-3"
                key={i.id}
              >
                <Link href={`/dish-setting?id=${i.id}`}>
                  <div className="flex items-center justify-center gap-4">
                    <h1>{i.name}</h1>
                  </div>
                </Link>

                <div className="flex items-center justify-center gap-2">
                  <Link href={`/dish-setting?id=${i.id}`}>
                    <Button
                      isIconOnly
                      size="sm"
                      className=" bg-black dark:bg-white dark:text-black"
                    >
                      <svg
                        className="h-4 w-4  text-white dark:text-black"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 18"
                      >
                        <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
                        <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
                      </svg>
                    </Button>{" "}
                  </Link>

                  <Button
                    isIconOnly
                    size="sm"
                    className=" bg-black dark:bg-white dark:text-black"
                    onClick={() => deleteM({ id: i.id })}
                  >
                    {deleteL ? (
                      <CircularProgress
                        size="sm"
                        aria-label="Loading..."
                        classNames={{
                          indicator: "stroke-white dark:stroke-black",
                        }}
                      />
                    ) : (
                      <svg
                        className="h-4 w-4  text-white dark:text-black"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            ))}
        </div>

        <div className="glass flex w-full items-center justify-center gap-3 rounded-2xl p-4">
          <Input
            variant="bordered"
            label="Категорія"
            size="sm"
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            isIconOnly
            size="lg"
            className=" bg-black dark:bg-white dark:text-black"
            onClick={() => mutate({ name: name })}
          >
            {isLoading ? (
              <CircularProgress
                size="sm"
                aria-label="Loading..."
                classNames={{
                  indicator: "stroke-white",
                }}
              />
            ) : (
              <svg
                className="h-6 w-6 text-white dark:text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 14h6m-3 3v-6M1.857 1h4.286c.473 0 .857.384.857.857v4.286A.857.857 0 0 1 6.143 7H1.857A.857.857 0 0 1 1 6.143V1.857C1 1.384 1.384 1 1.857 1Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 11 6.143V1.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H1.857A.857.857 0 0 1 1 16.143v-4.286c0-.473.384-.857.857-.857Z"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
