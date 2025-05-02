// app/shopEdit/[id]/ShopEditForm.tsx
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase";

export default function ShopEditForm({ id }: { id: string }) {
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("shopposts")
      .update({ stock, price })
      .eq("id", id);
    if (!error) {
      alert("更新しました");
      router.push("/private");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="在庫数"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <input
        type="text"
        placeholder="価格"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">送信</button>
    </form>
  );
}
