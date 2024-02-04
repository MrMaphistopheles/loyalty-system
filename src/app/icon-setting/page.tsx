import Image from "next/image";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import UploadIcon from "./_comp/UploadIcon";

export default async function Page() {
  async function getUserKeyPath() {
    "use server";
    const session = await getServerAuthSession();

    const pathKey = await db.company_url.findFirst({
      where: {
        userId: session?.user.id,
      },
      select: {
        path_key: true,
        icons: true,
      },
    });

    return pathKey;
  }

  const key = await getUserKeyPath();
  console.log();

  return (
    <>
      <h1 className="text-center text-lg">
        Іконка вашого застусунку в смартфоні користувача буде виглядати ось так.
      </h1>

      <div
        className="flex h-40 w-full flex-col items-center justify-start border-8 border-b-1  border-white bg-gray-300"
        style={{
          borderTopLeftRadius: "3rem",
          borderTopRightRadius: "3rem",
        }}
      >
        <div className="mt-4 flex w-full items-center justify-center gap-4">
          <div>
            <svg
              className="svg-icon"
              style={{
                width: "1.7em",
                height: "1.7em",
                verticalAlign: "middle",
                fill: "currentColor",
                overflow: "hidden",
              }}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M512 192c-163 0-326 67.2-443 176.6-6.6 6-6.8 16.2-0.6 22.8l53.4 55.8c6.2 6.6 16.6 6.8 23.2 0.6 46.6-43.2 99.8-77.6 158.6-102 66-27.6 136.2-41.4 208.6-41.4s142.6 14 208.6 41.4c58.8 24.6 112 58.8 158.6 102 6.6 6.2 17 6 23.2-0.6l53.4-55.8c6.2-6.4 6-16.6-0.6-22.8C838 259.2 675 192 512 192z" />
              <path d="M226.4 555l57.2 56.6c6.2 6 16 6.4 22.4 0.6 56.6-50.2 129.2-77.8 205.8-77.8s149.2 27.4 205.8 77.8c6.4 5.8 16.2 5.4 22.4-0.6l57.2-56.6c6.6-6.6 6.4-17.2-0.6-23.4-75-67.8-175.2-109.2-285-109.2s-210 41.4-285 109.2c-6.6 6.2-6.8 16.8-0.2 23.4zM512 648.4c-46.8 0-89.2 19.6-118.8 51-6 6.4-5.8 16.2 0.4 22.4l106.8 105.4c6.4 6.4 16.8 6.4 23.2 0l106.8-105.4c6.2-6.2 6.4-16 0.4-22.4-29.6-31.2-72-51-118.8-51z" />
            </svg>
          </div>
          <div className=" h-8 w-[46%] rounded-full bg-black"></div>
          <div className="h-8 ">
            <svg
              width="40px"
              height="100%"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24,0V24H0V0Z" fill="none" />
              <path
                d="M20,10V8.33A1.34,1.34,0,0,0,18.67,7H12V17h6.67A1.34,1.34,0,0,0,20,15.67V14h2V10Z"
                fillOpacity="0.3"
              />
              <path d="M12,7H3.34A1.34,1.34,0,0,0,2,8.33v7.33A1.34,1.34,0,0,0,3.33,17H12Z" />
            </svg>
          </div>
        </div>
        <div className="flex h-32 w-full items-center justify-center gap-4">
          <Image
            src={`${key?.icons[0]?.size_96}`}
            alt="Company icon"
            width={64}
            height={64}
            className=" h-16 w-16 rounded-xl bg-gray-100"
          />
          <div className=" h-16 w-16 rounded-xl bg-gray-100" />
          <div className=" h-16 w-16 rounded-xl bg-gray-100" />
          <div className=" h-16 w-16 rounded-xl bg-gray-100" />
        </div>
      </div>
      <p className="text-center text-lg">
        Заватажте іконку зі однаковим співвідношенням сторін та за розміром не
        більше 512х512 пікселів.
      </p>
      <UploadIcon pathKey={key?.path_key} />
    </>
  );
}
