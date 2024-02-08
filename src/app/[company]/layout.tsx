import "@/styles/globals.css";

import { ElementAnimation, Head } from "@/app/_components/app/Layout";
import { Metadata, ResolvingMetadata, MetadataRoute } from "next";
import { db } from "@/server/db";

type Props = {
  params: { company: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  async function getUserKeyPath() {
    "use server";

    const pathKey = await db.company_url.findFirst({
      where: {
        path_key: params.company,
      },
      select: {
        userId: true,
        icons: true,
      },
    });

    const companyName = await db.user.findUnique({
      where: {
        id: pathKey?.userId,
      },
      select: {
        name: true,
      },
    });

    return { ...pathKey, ...companyName };
  }

  const key = await getUserKeyPath();

  let stringifide = "";

  if (key.icons && key.icons[0]) {
    const manifest = {
      name: key.name,
      short_name: key.name,
      icons: [
        {
          src: key?.icons[0]?.size_96,
          sizes: "96x96",
        },
        {
          src: key?.icons[0]?.size_192,
          sizes: "192x192",
        },
        {
          src: key?.icons[0]?.size_512,
          sizes: "512x512",
        },
      ],
      theme_color: "#FFFFFF",
      background_color: "#FFFFFF",
      start_url: `${process.env.NEXT_PUBLIC_CALLBACK_URL_FOR_USER}/${params.company}`,
      display: "standalone",
      orientation: "portrait",
    };
    stringifide = JSON.stringify(manifest);
  }

  return {
    title: key.name,
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
