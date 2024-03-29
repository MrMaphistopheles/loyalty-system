"use client";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function SignInBtn({
  company,
  main,
}: {
  company?: string;
  main?: boolean;
}) {
  
  let url =
    main === true
      ? `${process.env.NEXT_PUBLIC_CALLBACK_URL_FOR_USER}`
      : `${process.env.NEXT_PUBLIC_CALLBACK_URL_FOR_USER}/${company}`;

  if (!process.env.NEXT_PUBLIC_CALLBACK_URL_FOR_USER)
    url =
      main === true
        ? `https://lite-theta.vercel.app/signin`
        : `https://lite-theta.vercel.app/signin/${company}`;

  return (
    <Button
      size="lg"
      className="w-full bg-black text-white"
      onClick={() => signIn("google", { callbackUrl: url })}
    >
      <svg
        className="h-6 w-6 text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 19"
      >
        <path
          fillRule="evenodd"
          d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
          clipRule="evenodd"
        />
      </svg>
      Authorize
    </Button>
  );
}
