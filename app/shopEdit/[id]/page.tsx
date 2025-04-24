"use client"
import React, { ChangeEvent, useEffect } from "react";
import { useState} from "react";
import { supabase } from "@/utils/supabase/supabase";
import { useRouter } from "next/navigation";
import { signIn,signOut } from "@/app/authSlice";
import { useDispatch } from "react-redux";


export default function ShopEdit({ params }: { params: { id: string } }) {
    const id ={params}
    const [stock, setStock] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const router = useRouter();
    const dispatch = useDispatch();

  const [user, setUser] = useState<string | null | undefined>(undefined);
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session?.user) {
              setUser(session.user.email || "GitHub User");
              dispatch(signIn({
                name: session.user.email,
                iconUrl: "",
                token: session.provider_token
              }));
              window.localStorage.setItem('oauth_provider_token', session.provider_token || "");
              window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token || "");
            }
    
            if (event === 'SIGNED_OUT') {
              window.localStorage.removeItem('oauth_provider_token');
              window.localStorage.removeItem('oauth_provider_refresh_token');
              setUser("");
              dispatch(signOut());
            }
          }
        );
    
        return () => {
          authListener?.subscription.unsubscribe();
        };
      }, [dispatch]);
      
    // 画像アップロード処理
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            alert("ユーザー情報を取得できませんでした。");
            return;
        }
        // 3. Supabase の shopposts テーブルにデータを保存
        const { data, error: updateError } = await supabase
            .from("shopposts")
            .update({
                    stock: stock,
                    price: price,
                })
            .eq("id", id)
    if (updateError) {
        console.error("DB 挿入エラー:", updateError);
        return;
    }
    if(data){
        alert("更新しました")
        router.push("/private")
    }
};
const handleStockChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value && e.target.value.length > 0) {
        setStock(e.target.value);
    }
}
const handlePriceChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value && e.target.value.length > 0) {
        setPrice(e.target.value);
    }
}
return (
    <>
        <form className="mb-4 text-center" onSubmit={onSubmit}>
            <input
                type="text"
                id="formStock"
                onChange={handleStockChange}
                placeholder="在庫数を変更"
                className="mb-2 border rounded p-2 w-full"
                value={stock}
            />
            <input
                type="text"
                id="formPrice"
                onChange={handlePriceChange}
                placeholder="商品の価格を編集(税抜)"
                className="mb-2 border rounded p-2 w-full"
                value={price}
            />
            <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 disabled:opacity-50"
        >
            送信
        </button>
        </form>
        
    </>
)
}