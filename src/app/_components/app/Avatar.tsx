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

export default function NavMenu() {
  const { data: session } = useSession();
  const image: string = session?.user?.image ?? "";
  const router = useRouter();

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut(); // Call the signOut function without passing any event object
  };

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
            {session.user.role === "WAITER" ? (
              <DropdownItem
                key="waiter-setting"
                onClick={() => handleRedirect("/waiter-setting")}
              >
                <div className="flex items-center justify-start gap-2">
     
                  <svg
                    className="h-4 w-4 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                  </svg>
                  Setting
                </div>
              </DropdownItem>
            ) : (
              <DropdownItem></DropdownItem>
            )}
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
