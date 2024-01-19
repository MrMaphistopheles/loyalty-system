"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@nextui-org/react";
import { UserRole } from "@prisma/client";
import { api } from "@/trpc/react";
import { type Res } from "../../../server/api/routers/user";

export default function Layout({
  children,
  customW,
  isVisible,
  gap,
}: {
  children: React.ReactNode;
  customW?: number;
  isVisible?: boolean;
  gap?: number;
}) {
  const pathname: string[] = usePathname().split("");

  const [isDark, setIsDark] = useState<boolean>();

  useEffect(() => {
    const getCurrentTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(getCurrentTheme());
  }, []);

  const { data: session } = useSession();

  let width: number;

  if (customW !== undefined) {
    width = customW;
  } else {
    width = 25;
  }

  const router = useRouter();
  if (!session) {
    router.push("/api/auth/signin");
  }

  if (session && session.user) {
    return (
      <div
        className={
          "flex h-[100dvh] flex-col items-center justify-end" +
          (isDark
            ? "text-white dark dark:bg-black"
            : "text-black light light:bg-[#ebfbff]")
        }
      >
        {isVisible === undefined ? (
          <div className="flex w-full items-center justify-between ">
            {pathname?.length > 1 ? (
              <Link href=".." className="px-4">
                <svg
                  className="h-6 w-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 10 16"
                >
                  <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z" />
                </svg>
              </Link>
            ) : (
              <>
                <Messages role={session.user.role} />
                <Money role={session.user.role} />
              </>
            )}

            <Avatar />
          </div>
        ) : null}

        <motion.div
          className={`flex h-full w-full flex-col items-center justify-center dark:text-white gap-${gap} px-2`}
          style={{
            maxWidth: `${width}rem`,
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
        {session.user.role === "USER" ? null : (
          <div className="static bottom-0 flex h-20 w-full items-center justify-center p-6">
            {session.user.role === "ADMIN" ? (
              <MenuForAdmin />
            ) : session.user.role === "MANAGER" ? (
              <MenuForManager />
            ) : null}
          </div>
        )}
      </div>
    );
  }
  return null;
}

function MenuForAdmin() {
  return (
    <div className="glass flex flex-row items-center justify-center gap-1 rounded-2xl">
      <Link href="/">
        <div className="hover:blured rounded-2xl p-3">
          <svg
            className="h-6 w-6 text-slate-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
        </div>
      </Link>

      <div className="hover:blured rounded-2xl p-3">
        <svg
          className="h-6 w-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
        </svg>
      </div>

      <div className="hover:blured rounded-2xl p-3">
        <svg
          className="h-6 w-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 19"
        >
          <path d="M7.324 9.917A2.479 2.479 0 0 1 7.99 7.7l.71-.71a2.484 2.484 0 0 1 2.222-.688 4.538 4.538 0 1 0-3.6 3.615h.002ZM7.99 18.3a2.5 2.5 0 0 1-.6-2.564A2.5 2.5 0 0 1 6 13.5v-1c.005-.544.19-1.072.526-1.5H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h7.687l-.697-.7ZM19.5 12h-1.12a4.441 4.441 0 0 0-.579-1.387l.8-.795a.5.5 0 0 0 0-.707l-.707-.707a.5.5 0 0 0-.707 0l-.795.8A4.443 4.443 0 0 0 15 8.62V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.12c-.492.113-.96.309-1.387.579l-.795-.795a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l.8.8c-.272.424-.47.891-.584 1.382H8.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.12c.113.492.309.96.579 1.387l-.795.795a.5.5 0 0 0 0 .707l.707.707a.5.5 0 0 0 .707 0l.8-.8c.424.272.892.47 1.382.584v1.12a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1.12c.492-.113.96-.309 1.387-.579l.795.8a.5.5 0 0 0 .707 0l.707-.707a.5.5 0 0 0 0-.707l-.8-.795c.273-.427.47-.898.584-1.392h1.12a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5ZM14 15.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        </svg>
      </div>
    </div>
  );
}

function MenuForManager() {
  return (
    <div className="glass flex flex-row items-center justify-center gap-1 rounded-2xl">
      <Link href="/">
        <div className="hover:blured rounded-2xl p-3">
          <svg
            className="h-6 w-6 text-slate-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
        </div>
      </Link>

      <Link href="/bonus-setting">
        <div className="hover:blured rounded-2xl p-3">
          <svg
            className="h-6 w-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
          </svg>
        </div>
      </Link>
      <Link href="/pass-setting">
        <div className="hover:blured rounded-2xl p-3">
          <svg
            className="h-6 w-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 21 21"
          >
            <path d="M20.817 9.085a10 10 0 0 0-19.77 2.9A10.108 10.108 0 0 0 6.762 20a9.689 9.689 0 0 0 4.2 1h.012a3.011 3.011 0 0 0 2.144-.884A2.968 2.968 0 0 0 14 18v-.86A1.041 1.041 0 0 1 15 16h2.7a2.976 2.976 0 0 0 2.838-2.024 9.93 9.93 0 0 0 .279-4.891ZM5.5 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm2.707-3.793a1 1 0 1 1-1.414-1.414 1 1 0 0 1 1.414 1.414Zm2.872-1.624a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.128 1.624a1 1 0 1 1-1.414-1.413 1 1 0 0 1 1.414 1.413Z" />
          </svg>
        </div>
      </Link>
      <Link href="/menu-setting">
        <div className="hover:blured rounded-2xl p-3">
          <svg
            className="h-6 w-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

function MenuForUser() {
  return (
    <div className="glass flex flex-row items-center justify-center gap-1 rounded-2xl">
      <Link href="/">
        <div className="hover:blured rounded-2xl p-3">
          <svg
            className="h-6 w-6 text-slate-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
        </div>
      </Link>

      <Link href="/bonus-setting">
        <div className="hover:blured rounded-2xl p-3">
          <svg
            className="h-6 w-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

function Messages({ role }: { role: UserRole | null }) {
  const { data, isLoading } = api.user.getRates.useQuery();
  const messageCount = data?.filter((i) => i.stars === 0);

  if (role === "USER") {
    if (isLoading) {
      return (
        <Link href="/messages" className="px-4">
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            viewBox="0 0 960.3 960.299"
          >
            <g>
              <path
                d="M0,862.281c0,23.4,25.6,37.8,45.6,25.601l156-95.101c9.4-5.7,20.2-8.8,31.2-8.8h667.5c33.101,0,60-26.9,60-60v-596
		c0-33.1-26.899-60-60-60H60c-33.1,0-60,26.9-60,60V862.281z"
              />
            </g>
          </svg>
        </Link>
      );
    }
    return (
      <Link href="/messages" className="px-4">
        {messageCount?.length === 0 ? (
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            viewBox="0 0 960.3 960.299"
          >
            <g>
              <path
                d="M0,862.281c0,23.4,25.6,37.8,45.6,25.601l156-95.101c9.4-5.7,20.2-8.8,31.2-8.8h667.5c33.101,0,60-26.9,60-60v-596
		c0-33.1-26.899-60-60-60H60c-33.1,0-60,26.9-60,60V862.281z"
              />
            </g>
          </svg>
        ) : (
          <Badge
            content={messageCount?.length}
            color="primary"
            placement="top-left"
          >
            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              viewBox="0 0 960.3 960.299"
            >
              <g>
                <path
                  d="M0,862.281c0,23.4,25.6,37.8,45.6,25.601l156-95.101c9.4-5.7,20.2-8.8,31.2-8.8h667.5c33.101,0,60-26.9,60-60v-596
		c0-33.1-26.899-60-60-60H60c-33.1,0-60,26.9-60,60V862.281z"
                />
              </g>
            </svg>
          </Badge>
        )}
      </Link>
    );
  }
}

function Money({ role }: { role: UserRole | null }) {
  const { data, isLoading } = api.waiter.getTips.useQuery();

  const tipsCount = data?.filter((i) => i.orderStatus === "approved").length;

  if (role === "WAITER") {
    if (isLoading || tipsCount === 0) {
      return (
        <Link href="/tips" className="px-4">
          <svg
            className="h-6 w-6 text-black dark:text-white"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 401.601 401.6"
          >
            <g>
              <g>
                <path
                  d="M116.682,229.329c11.286,0,22.195-0.729,32.518-2.086V114.094c-10.322-1.356-21.232-2.085-32.518-2.085
			c-64.441,0-116.681,23.693-116.681,52.921v11.477C0.001,205.634,52.241,229.329,116.682,229.329z"
                />
                <path
                  d="M116.682,288.411c11.286,0,22.195-0.729,32.518-2.084v-33.166c-10.325,1.356-21.229,2.095-32.518,2.095
			c-56.25,0-103.199-18.054-114.227-42.082c-1.606,3.5-2.454,7.124-2.454,10.839v11.477
			C0.001,264.718,52.241,288.411,116.682,288.411z"
                />
                <path
                  d="M149.199,314.823v-2.578c-10.325,1.356-21.229,2.095-32.518,2.095c-56.25,0-103.199-18.054-114.227-42.082
			C0.848,275.757,0,279.381,0,283.096v11.477c0,29.229,52.24,52.922,116.681,52.922c12.887,0,25.282-0.95,36.873-2.7
			c-2.873-5.877-4.355-12.075-4.355-18.496V314.823z"
                />
                <path
                  d="M284.92,22.379c-64.441,0-116.681,23.693-116.681,52.921v11.477c0,29.228,52.24,52.921,116.681,52.921
			c64.44,0,116.681-23.693,116.681-52.921V75.3C401.601,46.072,349.36,22.379,284.92,22.379z"
                />
                <path
                  d="M284.92,165.626c-56.25,0-103.199-18.053-114.227-42.082c-1.606,3.499-2.454,7.123-2.454,10.839v11.477
			c0,29.228,52.24,52.921,116.681,52.921c64.44,0,116.681-23.693,116.681-52.921v-11.477c0-3.716-0.848-7.34-2.454-10.839
			C388.119,147.573,341.17,165.626,284.92,165.626z"
                />
                <path
                  d="M284.92,224.71c-56.25,0-103.199-18.054-114.227-42.082c-1.606,3.499-2.454,7.123-2.454,10.839v11.477
			c0,29.229,52.24,52.922,116.681,52.922c64.44,0,116.681-23.693,116.681-52.922v-11.477c0-3.716-0.848-7.34-2.454-10.839
			C388.119,206.657,341.17,224.71,284.92,224.71z"
                />
                <path
                  d="M284.92,286.983c-56.25,0-103.199-18.054-114.227-42.082c-1.606,3.5-2.454,7.123-2.454,10.838v11.478
			c0,29.228,52.24,52.921,116.681,52.921c64.44,0,116.681-23.693,116.681-52.921v-11.478c0-3.715-0.848-7.34-2.454-10.838
			C388.119,268.928,341.17,286.983,284.92,286.983z"
                />
                <path
                  d="M284.92,346.066c-56.25,0-103.199-18.053-114.227-42.081c-1.606,3.5-2.454,7.125-2.454,10.838V326.3
			c0,29.228,52.24,52.921,116.681,52.921c64.44,0,116.681-23.693,116.681-52.921v-11.478c0-3.715-0.848-7.34-2.454-10.838
			C388.119,328.012,341.17,346.066,284.92,346.066z"
                />
              </g>
            </g>
          </svg>
        </Link>
      );
    }

    return (
      <Link href="/tips" className="px-4">
        <Badge content={tipsCount} color="primary" placement="top-left">
          <svg
            className="h-6 w-6 text-black dark:text-white"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 401.601 401.6"
          >
            <g>
              <g>
                <path
                  d="M116.682,229.329c11.286,0,22.195-0.729,32.518-2.086V114.094c-10.322-1.356-21.232-2.085-32.518-2.085
			c-64.441,0-116.681,23.693-116.681,52.921v11.477C0.001,205.634,52.241,229.329,116.682,229.329z"
                />
                <path
                  d="M116.682,288.411c11.286,0,22.195-0.729,32.518-2.084v-33.166c-10.325,1.356-21.229,2.095-32.518,2.095
			c-56.25,0-103.199-18.054-114.227-42.082c-1.606,3.5-2.454,7.124-2.454,10.839v11.477
			C0.001,264.718,52.241,288.411,116.682,288.411z"
                />
                <path
                  d="M149.199,314.823v-2.578c-10.325,1.356-21.229,2.095-32.518,2.095c-56.25,0-103.199-18.054-114.227-42.082
			C0.848,275.757,0,279.381,0,283.096v11.477c0,29.229,52.24,52.922,116.681,52.922c12.887,0,25.282-0.95,36.873-2.7
			c-2.873-5.877-4.355-12.075-4.355-18.496V314.823z"
                />
                <path
                  d="M284.92,22.379c-64.441,0-116.681,23.693-116.681,52.921v11.477c0,29.228,52.24,52.921,116.681,52.921
			c64.44,0,116.681-23.693,116.681-52.921V75.3C401.601,46.072,349.36,22.379,284.92,22.379z"
                />
                <path
                  d="M284.92,165.626c-56.25,0-103.199-18.053-114.227-42.082c-1.606,3.499-2.454,7.123-2.454,10.839v11.477
			c0,29.228,52.24,52.921,116.681,52.921c64.44,0,116.681-23.693,116.681-52.921v-11.477c0-3.716-0.848-7.34-2.454-10.839
			C388.119,147.573,341.17,165.626,284.92,165.626z"
                />
                <path
                  d="M284.92,224.71c-56.25,0-103.199-18.054-114.227-42.082c-1.606,3.499-2.454,7.123-2.454,10.839v11.477
			c0,29.229,52.24,52.922,116.681,52.922c64.44,0,116.681-23.693,116.681-52.922v-11.477c0-3.716-0.848-7.34-2.454-10.839
			C388.119,206.657,341.17,224.71,284.92,224.71z"
                />
                <path
                  d="M284.92,286.983c-56.25,0-103.199-18.054-114.227-42.082c-1.606,3.5-2.454,7.123-2.454,10.838v11.478
			c0,29.228,52.24,52.921,116.681,52.921c64.44,0,116.681-23.693,116.681-52.921v-11.478c0-3.715-0.848-7.34-2.454-10.838
			C388.119,268.928,341.17,286.983,284.92,286.983z"
                />
                <path
                  d="M284.92,346.066c-56.25,0-103.199-18.053-114.227-42.081c-1.606,3.5-2.454,7.125-2.454,10.838V326.3
			c0,29.228,52.24,52.921,116.681,52.921c64.44,0,116.681-23.693,116.681-52.921v-11.478c0-3.715-0.848-7.34-2.454-10.838
			C388.119,328.012,341.17,346.066,284.92,346.066z"
                />
              </g>
            </g>
          </svg>
        </Badge>
      </Link>
    );
  }
}
