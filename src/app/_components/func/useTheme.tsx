"use client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

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
          ? "dark text-white dark:bg-black"
          : "light light:bg-[#ebfbff] text-black")
      }
    >
      <Helmet>
        {isDark ? (
          <meta name="theme-color" content="#000" />
        ) : (
          <meta name="theme-color" content="#ebfbff" />
        )}
      </Helmet>

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
