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

  console.log(isDark);

  return (
    <>
      <body
        className={
          `${font}` +
          (isDark
            ? "text-white dark dark:bg-black"
            : "text-black light light:bg-[#f6fdff]")
        }
      >
        <HelmetProvider>
          <Helmet>
            <meta name="theme-color" content={isDark ? "#000" : "#f6fdff"} />
          </Helmet>
        </HelmetProvider>
        {children}
      </body>
    </>
  );
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>();

  useEffect(() => {
    const getCurrentTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(getCurrentTheme());
    return () => {};
  }, []);

  return { isDark };
}
