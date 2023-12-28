"use client";
import { signOut, useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { Avatar } from "@nextui-org/react";

export default function NavMenu() {
  const { data: session } = useSession();
  const image: string = session?.user?.image ?? "";

  const handleSignOut = async () => {
    await signOut(); // Call the signOut function without passing any event object
  };


  return (
    <div className="flex w-full items-center justify-end p-3">
      {session?.user ? (
        <Dropdown>
          <DropdownTrigger>
            <Avatar  src={image} />
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
