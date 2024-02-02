"use client";
import { useEffect, useState } from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";

export function Body({
  children,
  font,
}: {
  children: React.ReactNode;
  font?: string;
}) {
  const { isDark } = useTheme();
  return (
    <body
      className={
        `${font}` +
        (isDark
          ? "text-white dark dark:bg-black"
          : "text-black light light:bg-[#ebfbff]")
      }
    >
      <HelmetProvider>
        <Helmet>
          {isDark ? (
            <meta name="theme-color" content="#000" />
          ) : (
            <meta name="theme-color" content="#ebfbff" />
          )}
        </Helmet>
      </HelmetProvider>
      {children}
    </body>
  );
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>();

  useEffect(() => {
    const getCurrentTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(getCurrentTheme());
  }, []);

  return { isDark };
}
