"use client";
import { api } from "@/trpc/react";
import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  Skeleton,
  CircularProgress,
  Avatar,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Created } from "@/server/api/routers/manager";

type Role = "admin" | "manager";

export default function DashBord({ role }: { role: Role }) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { data: session } = useSession();

  const { mutate, isLoading, isError, isSuccess } =
    api[role as Role].create.useMutation();

  let deleteUser: ({ id }: { id: string }) => Promise<void> | void;
  let isLDelete = false;
  let isEDelete = false;
  let isSDelete = false;

  if (role === "admin") {
    const deleteUserMutation = api.admin.delete.useMutation();

    deleteUser = deleteUserMutation.mutate;
    isLDelete = deleteUserMutation.isLoading;
    isEDelete = deleteUserMutation.isError;
    isSDelete = deleteUserMutation.isSuccess;
  } else if (role === "manager") {
    const deleteUserMutation = api.manager.delete.useMutation();

    deleteUser = deleteUserMutation.mutate;
    isLDelete = deleteUserMutation.isLoading;
    isEDelete = deleteUserMutation.isError;
    isSDelete = deleteUserMutation.isSuccess;
  }

  const handleDelete = (id: string) => {
    deleteUser({ id });
  };

  let data;
  let isLoadingData = false;
  let isErrorData = false;
  let refetch: () => void = () => {};

  if (role === "admin") {
    const result = api.admin.getUser.useQuery();

    data = result.data;
    isLoadingData = result.isLoading;
    isErrorData = result.isError;
    refetch = result.refetch;
  } else if (role === "manager") {
    const result = api.manager.getUser.useQuery();

    data = result.data;
    isLoadingData = result.isLoading;
    isErrorData = result.isError;
    refetch = result.refetch;
  }

  useEffect(() => {
    void refetch();
  }, [isSuccess, isSDelete]);

  console.log(data);

  let created: Created;
  if (data && data[0]) {
    created = data[0].created;
  } else {
    created = [];
  }

  const handleClick = () => {
    mutate({
      name: name,
      email: email,
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 dark:text-white">
      {isError ?? isErrorData ?? isEDelete ? (
        <div
          className="glass mb-4 flex items-center rounded-lg p-4 text-sm text-red-800"
          role="alert"
        >
          <svg
            className="me-3 inline h-4 w-4 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Помилка</span> Помилка сервера спробуй
            пізніше.
          </div>
        </div>
      ) : null}

      <div className="glass flex w-full flex-col items-center justify-center gap-2 rounded-2xl px-8  py-5">
        <h1 className="py-4 text-2xl">
          {session?.user.role === "ADMIN"
            ? "Add Company"
            : session?.user.role
              ? "Додати менеджера"
              : null}
        </h1>
        <Input
          variant="bordered"
          type="text"
          label={
            session?.user.role === "ADMIN"
              ? "Company Name"
              : session?.user.role
                ? "Ім'я"
                : null
          }
          size="sm"
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          variant="bordered"
          type="email"
          label="email"
          size="sm"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          size="lg"
          className="w-full bg-black text-white dark:bg-white dark:text-black"
          onClick={handleClick}
          isLoading={isLoading}
        >
          {isLoading ? "Loading ..." : "Add"}
        </Button>
      </div>
      <div className="glass flex max-h-[20em] w-full flex-col items-center justify-center gap-2 overflow-x-auto  overflow-y-auto rounded-2xl">
        {isLoadingData ? (
          <SkeletonFor />
        ) : (
          <Listbox
            aria-label="Actions"
            onAction={(key) => alert(key)}
            className="h-full"
          >
            {created ? (
              created.map((i) => (
                <ListboxItem key={i.id} variant="solid" textValue="wokers">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-2">
                      <Avatar
                        src={i.image ?? ""}
                        size="sm"
                        className="mx-1"
                        classNames={{
                          base: "bg-black",
                          icon: "text-white",
                        }}
                      />
                      <span className="font-bold">{i.name}</span>
                    </div>

                    <Button
                      isIconOnly
                      className="bg-black"
                      onClick={() => handleDelete(i.id)}
                    >
                      {isLDelete ? (
                        <CircularProgress
                          size="sm"
                          aria-label="Loading..."
                          classNames={{
                            indicator: "stroke-white",
                          }}
                        />
                      ) : (
                        <DeleteIcon />
                      )}
                    </Button>
                  </div>
                </ListboxItem>
              ))
            ) : (
              <ListboxItem key={404} textValue="no items">
                No items
              </ListboxItem>
            )}
          </Listbox>
        )}
      </div>
    </div>
  );
}

function DeleteIcon() {
  return (
    <svg
      className="h-4 w-4 text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 18"
    >
      <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
    </svg>
  );
}

function SkeletonFor() {
  const arr = [...Array(5).keys()];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 p-8">
      {arr.map((i) => (
        <div className="flex w-full items-center justify-between" key={i}>
          <Skeleton className="w-3/5 rounded-lg">
            <div className="bg-default-200 h-4 w-3/5 rounded-lg"></div>
          </Skeleton>
          <Skeleton className="w-10 rounded-lg">
            <div className="bg-default-200 h-10 w-3/5 rounded-lg"></div>
          </Skeleton>
        </div>
      ))}
    </div>
  );
}
