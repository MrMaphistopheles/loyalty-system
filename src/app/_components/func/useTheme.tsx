"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>();

  useEffect(() => {
    const getCurrentTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(getCurrentTheme());
  }, []);

  return { isDark };
}

export function Body({
  children,
  font,
}: {
  children: React.ReactNode;
  font?: string;
}) {
  const [isDark, setIsDark] = useState<boolean>();

  useEffect(() => {
    const getCurrentTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(getCurrentTheme());
  }, []);

  return (
    <body
      className={
        `${font}` +
        (isDark
          ? "text-white dark dark:bg-black"
          : "text-black light light:bg-[#ebfbff]")
      }
    >
      {children}
    </body>
  );
}
