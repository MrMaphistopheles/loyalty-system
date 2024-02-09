"use client";

import { Avatar, Button } from "@nextui-org/react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";

const calculateCount = (gift: number, points: number) => {
  return gift - points;
};

export default function Card({ company }: { company: string }) {
  const [show, setShow] = useState<number>();
  const [height, setHeight] = useState(0);
  const { data: session } = useSession();

  const changePosition = (index: number) => {
    if (index === show) {
      setShow(undefined);
    } else {
      setShow(index);
    }
  };

  const { data, refetch, isSuccess } = api.user.getUserDataT.useQuery(
    {
      key: company,
    },
    {
      refetchOnMount: false,
    },
  );

  console.log(data);

  const { mutate, isLoading: passIsLoading } =
    api.user.autoCreateBonusAcc.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  useEffect(() => {
    if (data && data[0]) {
      if (data[0]?.points === undefined) mutate({ key: company });
    }
    return () => {};
  }, [data]);

  useEffect(() => {
    calculateHeight();
  }, []);

  const calculateHeight = () => {
    const body = document.querySelector("body");
    if (body) {
      const newHeigth = body.clientHeight;
      setHeight(newHeigth);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-end gap-3">
      <div className="relative w-full">
        {data &&
          data.map((i, index) => (
            <div key={index} onClick={() => changePosition(index)}>
              <Pass
                z={index}
                name={i?.name ?? ""}
                translate={show === index ? -(height / 15) : height / 12}
                show={show === index ? true : false}
                userName={session?.user.name ?? "s"}
                countOf={
                  i.bonusSystem && i.bonusSystem[0]?.gift && i.points
                    ? calculateCount(i.bonusSystem[0]?.gift, i.points)
                    : 0
                }
                color={i.Theme && i.Theme[0]?.color}
                icon={i.Theme && i.Theme[0]?.image}
                linkToMenu={`/${company}/menu?id=${i.id}`}
                qrVal={session?.user.id ?? ""}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

const CameraIcon = ({
  fill,
  size,
  height,
  width,
}: {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export function Pass({
  z,
  t,
  name,
  translate,
  show,
  color,
  userName,
  countOf,
  linkToMenu,
  qrVal,
  icon,
  visble,
  position,
  onClick,
}: {
  z: number;
  t?: number;
  name: string;
  translate: number;
  show?: boolean;
  color: string | undefined;
  userName: string;
  countOf: number;
  linkToMenu: string;
  qrVal: string;
  icon?: string | null;
  visble?: boolean;
  position?: "relative" | "absolute" | "fixed" | "sticky" | undefined;
  onClick?: () => void;
}) {
  const transition: number = translate;

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-3"
      style={{
        zIndex: `${z}`,
        top: `${t}px`,
        transform: `translate(0, ${transition}%)`,
        transition: `0.8s linear`,
        position: position === undefined ? "absolute" : position,
      }}
    >
      <div className="glass flex w-full flex-col items-center justify-center rounded-3xl">
        <div
          className="flex w-full items-center justify-start gap-3 rounded-t-3xl px-6 py-3"
          style={{ backgroundColor: `#${color}`, transition: "0.3s linear" }}
        >
          <Avatar
            onClick={onClick}
            size="lg"
            src={icon !== null ? icon : ""}
            fallback={<CameraIcon size={35} />}
          />
          <h1 className="text-xl text-white">{name}</h1>
        </div>
        <div className="flex w-full items-center justify-between gap-3 rounded-t-3xl p-4">
          <h1 className="text-lg text-black dark:text-white">{userName}</h1>
          <h1 className="text-md text-black dark:text-white">
            До безкоштовної кави {countOf} покупок
          </h1>
        </div>
        {show ? (
          <motion.div
            className="flex w-full items-center justify-center gap-3 rounded-t-3xl pb-10 pt-4"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded-lg bg-white p-4">
              <QRCodeCanvas value={qrVal} />
            </div>
          </motion.div>
        ) : null}
      </div>
      {visble === false ? (
        visble
      ) : show ? (
        <motion.div
          className="glass flex w-full rounded-3xl p-4"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Link
            href={linkToMenu}
            className="flex w-full items-center justify-between"
          >
            <span className="pl-6 text-xl text-black dark:text-white">
              Menu
            </span>

            <Button
              size="lg"
              isIconOnly
              className="rounded-full bg-white text-lg text-black"
            >
              <svg
                className="h-6 w-6 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </Button>
          </Link>
        </motion.div>
      ) : null}
    </div>
  );
}
