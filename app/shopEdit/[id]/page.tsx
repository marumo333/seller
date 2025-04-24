"use client";

import { useParams } from "next/navigation";
import ShopEditForm from "./shopEditForm"; // クライアント側フォーム

export default function Page() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  return <ShopEditForm id={id} />;
}
