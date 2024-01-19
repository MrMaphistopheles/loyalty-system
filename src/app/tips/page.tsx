"use client";
import { Line } from "react-chartjs-2";
import { api } from "@/trpc/react";
import Layout from "../_components/app/Layout";
import { Skeleton } from "@nextui-org/react";

export default function Tips() {
  const { data, isLoading } = api.waiter.getTips.useQuery();

  const sum = data
    ?.map((i) => i.amount)
    .reduce((prev, curent) => prev + curent, 0);
  const validSum = Math.round(sum !== undefined ? sum / 100 : 0);

  return (
    <Layout gap={2}>
      <MoneyBar />
      <div className="glass flex h-[13em] w-full items-center justify-center rounded-xl">
        {isLoading ? (
          <LoadingSum />
        ) : (
          <>
            <div className="flex h-11 items-end justify-center">
              <p>uah</p>
            </div>
            <h1 className="text-[280%] font-bold text-black dark:text-white">
              {validSum} ₴
            </h1>
          </>
        )}
      </div>
    </Layout>
  );
}

function LoadingSum() {
  return (
    <div className="flex w-full items-center justify-center">
      <Skeleton className="h-12 w-3/5 rounded-lg" />
    </div>
  );
}

const labels = [1,2,4,4,5,6,7]
const data = {
  labels: labels,
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
function MoneyBar() {
  return (
    <div className="glass flex h-[13em] w-full items-center justify-center rounded-xl">
      <Line data={data} datasetIdKey="id" />
    </div>
  );
}
