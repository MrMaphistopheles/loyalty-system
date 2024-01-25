import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { getServerAuthSession } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";
import { UiProvider } from "@/app/_components/providers/UiProvider";
import { Body } from "@/app/_components/func/useTheme";
import { Bottom, ElementAnimation, Head } from "./_components/app/Layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  manifest: "/manifest.json",
  title: "Bonus App",
  description: "Loyalty system",
};
export const viewport = {
  themeColor: "#000",
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <Body font={`font-sans ${inter.variable} `}>
        <TRPCReactProvider cookies={cookies().toString()} session={session}>
          <UiProvider>
            <div className="flex h-[100dvh] flex-col items-center justify-between">
              <Head />
              <ElementAnimation>{children}</ElementAnimation>
              <Bottom />
            </div>
          </UiProvider>
        </TRPCReactProvider>
      </Body>
    </html>
  );
}

//bg-gradient-to-tr from-fuchsia-300 to-cyan-300
