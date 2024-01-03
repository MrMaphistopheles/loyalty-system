"use client";
import { Button, CircularProgress, Input } from "@nextui-org/react";
import Layout from "../_components/app/Layout";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function Menu() {
  const [name, setName] = useState("");

  const {
    data,
    isLoading: categoryLoading,
    refetch,
  } = api.manager.getCategory.useQuery();

  const { mutate, isLoading } = api.manager.addCategory.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="flex h-[35em] w-full flex-col items-center justify-center gap-2 overflow-auto px-2 pb-6">
          {data &&
            data.categorys.map((i) => (
              <div
                className="glass-sm-sh flex w-full items-center justify-between rounded-lg p-3"
                key={i.id}
              >
                <div className="flex items-center justify-center gap-4">
                  <h1>{i.name}</h1>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    className=" bg-black dark:bg-white dark:text-black"
                  >
                    <svg
                      className="h-4 w-4 text-white dark:text-black"
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
                  </Button>
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
                      viewBox="0 0 18 20"
                    >
                      <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                    </svg>
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
    </Layout>
  );
}
