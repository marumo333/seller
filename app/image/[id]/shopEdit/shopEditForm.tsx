"use client";

import {  useState } from "react";
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
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">商品情報を編集</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">在庫数</label>
                    <input
                        type="text"
                        placeholder="在庫数"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">価格</label>
                    <input
                        type="text"
                        placeholder="価格"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    送信
                </button>
            </form>
        </div>
    );
}
