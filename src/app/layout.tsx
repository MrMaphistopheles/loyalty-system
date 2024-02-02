import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { getServerAuthSession } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";
import { UiProvider } from "@/app/_components/providers/UiProvider";
import { Body } from "@/app/_components/func/useTheme";
import { Bottom, ElementAnimation, Head } from "@/app/_components/app/Layout";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Bonus App",
  description: "Loyalty system",

};
export const viewport = {
  maximumScale: 1,
  themeColor: "#fff"
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { company: string };
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <Body font={`font-sans ${inter.variable} `}>
        <TRPCReactProvider cookies={cookies().toString()} session={session}>
          <UiProvider>
            <div className="flex h-[100dvh] flex-col items-center justify-between">
              {session?.user.role === "USER" ? (
                <>{children}</>
              ) : (
                <>
                  <Head company={params.company} />
                  <ElementAnimation>{children}</ElementAnimation>
                  <Bottom />
                </>
              )}
            </div>
          </UiProvider>
        </TRPCReactProvider>
      </Body>
    </html>
  );
}
