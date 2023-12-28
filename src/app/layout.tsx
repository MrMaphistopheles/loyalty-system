import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { getServerAuthSession } from "@/server/auth";
import type { Session } from "next-auth";
import { TRPCReactProvider } from "@/trpc/react";
import { UiProvider } from "@/app/_components/providers/UiProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession()
  return (
    <html lang="en" className="light dark:dark">
      <body className={`font-sans ${inter.variable} bg-gradient-to-tr from-fuchsia-300 to-cyan-300`}>
        <TRPCReactProvider cookies={cookies().toString()} session={session}>
          <UiProvider>{children}</UiProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
