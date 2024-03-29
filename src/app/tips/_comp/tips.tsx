"use client";
import { api } from "@/trpc/react";
import { Button, Skeleton } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";
import Link from "next/link";

import { useTheme } from "@/app/_components/func/useTheme";

export default function Tips() {
  const { data, isLoading } = api.waiter.getTips.useQuery();
  const [isSelected, setSelected] = useState(7);

  const { data: ChartData, refetch } = api.waiter.getTipsDataForChart.useQuery({
    days: isSelected,
  });

  let lables: string[] = [];
  let Data: number[] = [];
  if (ChartData && ChartData[0]?.date) {
    lables = ChartData?.map((i) => i.date.slice(0, 10));
    Data = ChartData?.map((i) => Math.round(i.amount) / 100);
  }

  const { isDark } = useTheme();

  console.log(isDark);

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: isDark ? "#fff" : "#000",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: isDark ? "#fff" : "#000",
        },
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  const chartData = {
    labels: lables,
    datasets: [
      {
        label: "uah",
        data: Data,
        fill: false,
        borderColor: isDark ? "#fff" : "#000",
        backgroundColor: isDark ? "#fff" : "#000",
        tension: 0.5,
        pointStyle: false,
      },
    ],
  };

  useEffect(() => {
    void refetch();
  }, [isSelected]);

  const btn = [
    { item: "7 days", val: 7 },
    { item: "30 days", val: 30 },
    { item: "90 days", val: 90 },
    { item: "Year", val: 365 },
  ];

  return (
    <>
      <LineChart data={chartData} options={chartOptions} />
      <div className="flex w-full items-center justify-center gap-2">
        {btn.map((i) => (
          <Button
            key={i.val}
            onClick={() => setSelected(i.val)}
            variant="solid"
            size="md"
            className={
              isSelected === i.val
                ? "bg-white text-black dark:bg-black  dark:text-white"
                : "bg-black text-white dark:bg-white  dark:text-black"
            }
          >
            {i.item}
          </Button>
        ))}
      </div>
      <div className="glass flex h-[13em] w-full items-center justify-center rounded-xl">
        {isLoading ? (
          <LoadingSum />
        ) : (
          <>
            <div className="flex h-11 items-end justify-center">
              <p>uah</p>
            </div>
            <h1 className="text-[280%] font-bold text-black dark:text-white">
              {data?.balance !== undefined ? data.balance / 100 : null} ₴
            </h1>
          </>
        )}
      </div>
      <Link
        href={`/withdraw`}
        className="flex w-full items-center justify-center"
      >
        <Button
          variant="solid"
          size="lg"
          className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
        >
          Вивести
        </Button>
      </Link>
    </>
  );
}

function LoadingSum() {
  return (
    <div className="flex w-full items-center justify-center">
      <Skeleton className="h-12 w-3/5 rounded-lg" />
    </div>
  );
}

interface LineChartProps {
  data: ChartData;
  options: ChartOptions;
}

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Create the chart
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const myChart = new Chart(ctx, {
          type: "line",
          data: data,
          options: options,
        });

        // Cleanup function to destroy the chart when the component unmounts
        return () => {
          myChart.destroy();
        };
      }
    }
  }, [data, options]);

  return (
    <div className="glass flex h-[13em] w-full items-center justify-center rounded-xl p-3">
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
};
