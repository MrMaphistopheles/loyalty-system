"use client";
import { api } from "@/trpc/react";
import Layout from "../_components/app/Layout";
import { Button, Skeleton } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";

const chartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "#000",
      tension: 0.5,
      pointStyle: false,
    },
  ],
};

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function Tips() {
  const { data, isLoading } = api.waiter.getTips.useQuery();

  const sum = data
    ?.map((i) => i.amount)
    .reduce((prev, curent) => prev + curent, 0);
  const validSum = Math.round(sum !== undefined ? sum / 100 : 0);

  return (
    <Layout gap={4}>
      <LineChart data={chartData} options={chartOptions} />
      <Buttons />
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
      <Button
        variant="solid"
        size="lg"
        className="bg-black text-white dark:bg-white dark:text-black w-2/3"
      >
        Вивести
      </Button>
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


function Buttons() {
  const [isSelected, setSelected] = useState<string>();

  const btn = [
    { val: "7 days" },
    { val: "30 days" },
    { val: "90 days" },
    { val: "Year" },
  ];
  return (
    <div className="flex w-full items-center justify-center gap-2">
      {btn.map((i) => (
        <Button
          onClick={() => setSelected(i.val)}
          variant="solid"
          size="md"
          className="bg-black text-white dark:bg-white dark:text-black "
        >
          {i.val}
        </Button>
      ))}
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
