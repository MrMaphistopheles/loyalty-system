import "@/styles/globals.css";

import { ElementAnimation, Head } from "@/app/_components/app/Layout";
export const metadata = {
  manifest: "/manifest.json",
  title: "Bonus App",
  description: "Loyalty system",
};
export const viewport = {
  maximumScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { company: string };
}) {
  return (
    <>
      <Head company={params.company} />
      <ElementAnimation>{children}</ElementAnimation>
    </>
  );
}
