"use client";
import { signOut, useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { Avatar } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavMenu() {
  const { data: session } = useSession();
  const image: string = session?.user?.image ?? "";

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(); // Call the signOut function without passing any event object
  };

  if (session?.user.role === "WAITER") {
    return (
      <div className="flex w-full items-center justify-end p-3 dark:text-white">
        {session?.user ? (
          <Dropdown className="dark:bg-gray-900 dark:text-white">
            <DropdownTrigger>
              <Avatar src={image} />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="Signed">
                Signed in as {session.user.email}
              </DropdownItem>

              <DropdownItem
                key="waiter-rating"
                onClick={() => router.push("/waiter-rating")}
              >
                <div className="flex items-center justify-start gap-2">
                  <svg
                    className="h-4 w-4 text-black dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                  </svg>
                  Rating
                </div>
              </DropdownItem>

              <DropdownItem
                key="withdraw-request"
                onClick={() => router.push("/withdraw-request")}
              >
                <div className="flex items-center justify-start gap-2">
                  <svg
                    className="h-4 w-4 text-black dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                    />
                  </svg>
                  withdraw
                </div>
              </DropdownItem>

              <DropdownItem
                key="LogOut"
                className="text-danger"
                color="danger"
                onClick={handleSignOut}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-end p-3 dark:text-white">
      {session?.user ? (
        <Dropdown className="dark:bg-gray-900 dark:text-white">
          <DropdownTrigger>
            <Avatar src={image} />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="Signed">
              Signed in as {session.user.email}
            </DropdownItem>

            <DropdownItem
              key="LogOut"
              className="text-danger"
              color="danger"
              onClick={handleSignOut}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : null}
    </div>
  );
}
