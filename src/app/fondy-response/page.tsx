"use client";

import { useSearchParams } from "next/navigation";
import Layout from "../_components/app/Layout";
import { api } from "@/trpc/react";

export default function Fondy() {
  const searchPram = useSearchParams();
  const orderId = searchPram.get("order_id") ?? "";
  const orderStatus = searchPram.get("order_status") ?? "";
  return (
    <Layout>
      <div>
        <p>{orderId}</p>
        <p>{orderStatus}</p>
      </div>
    </Layout>
  );
}
