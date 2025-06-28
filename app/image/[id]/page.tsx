// app/image/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ImageClient from "./ImageClient"; // そのままでOK

export default function Page() {
  const params = useParams(); // 👈 useParams で id を取得
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  return <ImageClient id={id} />;
}

