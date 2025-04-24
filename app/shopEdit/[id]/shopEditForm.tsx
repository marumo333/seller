"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { supabase } from "@/utils/supabase/supabase";
import { signIn, signOut } from "@/app/authSlice";

export default function ShopEditForm({ id }: { id: string }) {
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        dispatch(signIn({
          name: session.user.email,
          iconUrl: "",
          token: session.provider_token,
        }));
        window.localStorage.setItem("oauth_provider_token", session.provider_token || "");
        window.localStorage.setItem("oauth_provider_refresh_token", session.provider_refresh_token || "");
      }
      if (event === "SIGNED_OUT") {
        window.localStorage.removeItem("oauth_provider_token");
        window.localStorage.removeItem("oauth_provider_refresh_token");
        dispatch(signOut());
      }
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => setStock(e.target.value);
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return alert("ログインしてください");

    const { data, error } = await supabase
      .from("shopposts")
      .update({ stock, price })
      .eq("id", id);

    if (error) return console.error("更新エラー:", error);
    if (data) {
      alert("更新しました");
      router.push("/private");
    }
  };

  return (
    <form className="mb-4 text-center" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="在庫数を変更"
        className="mb-2 border rounded p-2 w-full"
        value={stock}
        onChange={handleStockChange}
      />
      <input
        type="text"
        placeholder="商品の価格を編集(税抜)"
        className="mb-2 border rounded p-2 w-full"
        value={price}
        onChange={handlePriceChange}
      />
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 disabled:opacity-50"
      >
        送信
      </button>
    </form>
  );
}
