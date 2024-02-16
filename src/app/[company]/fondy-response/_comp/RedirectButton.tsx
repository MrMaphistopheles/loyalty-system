"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
export default function RedirectButton({ path }: { path: string }) {
  const router = useRouter();
  return (
    <div className="w-full flex items-center justify-center pt-10">
      <Button
        size="lg"
        className="bg-black text-white dark:bg-white dark:text-black"
        onClick={() => {
          router.push(
            `${process.env.NEXT_PUBLIC_CALLBACK_URL_FOR_USER}${path}`,
          );
        }}
      >
        <svg
          className="h-6 w-6 text-white dark:text-black"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M11.3 3.3a1 1 0 0 1 1.4 0l6 6 2 2a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2v-6.6l-.3.3a1 1 0 0 1-1.4-1.4l2-2 6-6Z"
            clipRule="evenodd"
          />
        </svg>
        Повернутися
      </Button>
    </div>
  );
}
