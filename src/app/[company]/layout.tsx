import "@/styles/globals.css";

import { ElementAnimation, Head } from "@/app/_components/app/Layout";
import { Metadata, ResolvingMetadata, MetadataRoute } from "next";

type Props = {
  params: { company: string };
};



export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {

  const maifest = {
    name: "Bonus App",
    short_name: "Bonus App",
    icons: [
      {
        src: "https://storage.googleapis.com/bonuslite1/192.png",
        sizes: "192x192",
      },
    ],
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    start_url: `http://localhost:3000/${params.company}`,
    display: "standalone",
    orientation: "portrait",
  };

  const stringifide = JSON.stringify(maifest);

  return {
    manifest:
      "data:application/json;charset=utf-8," + encodeURIComponent(stringifide),
  };
}

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
