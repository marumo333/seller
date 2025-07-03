"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { v4 as uuid4 } from "uuid";
import { signIn, signOut } from "../authSlice";
import { useDispatch } from "react-redux";

export default function Page() {
  const [name, setName] = useState("");
  const [jan, setJan] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const dispatch = useDispatch();

  const [user, setUser] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user.email || "GitHub User");
          dispatch(
            signIn({
              name: session.user.email,
              iconUrl: "",
              token: session.provider_token,
            })
          );
          window.localStorage.setItem(
            "oauth_provider_token",
            session.provider_token || ""
          );
          window.localStorage.setItem(
            "oauth_provider_refresh_token",
            session.provider_refresh_token || ""
          );
        }

        if (event === "SIGNED_OUT") {
          window.localStorage.removeItem("oauth_provider_token");
          window.localStorage.removeItem("oauth_provider_refresh_token");
          setUser("");
          dispatch(signOut());
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!file || !file.type.match("image.*")) {
      alert("画像ファイルを選択してください");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      alert("ログインしてください");
      return;
    }

    const fileName = `${uuid4()}.${file.name.split(".").pop()}`;
    const filePath = `img/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("shopposts")
      .upload(filePath, file);

    if (uploadError) {
      alert("アップロード失敗: " + uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("shopposts")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase
      .from("shopposts")
      .insert([
        {
          name,
          image_url: publicUrl,
          url: publicUrl,
          jan,
          content,
          tag,
          stock,
          price,
        },
      ]);

    if (insertError) {
      alert("登録失敗: " + insertError.message);
      return;
    }

    setFile(null);
    setStatus("アップロードが完了しました！");
  };

  return (
    <>
      {user ? (
        <>
          <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">商品投稿</h1>

            <form className="mb-4 text-center" onSubmit={onSubmit}>
              {[
                { v: name, s: setName, p: "商品名" },
                { v: jan, s: setJan, p: "JANコード" },
                { v: content, s: setContent, p: "内容" },
                { v: tag, s: setTag, p: "タグ" },
                { v: stock, s: setStock, p: "在庫" },
                { v: price, s: setPrice, p: "価格（税抜）" },
              ].map(({ v, s, p }, i) =>
                p === "内容" ? (
                  <textarea
                    key={i}
                    className="mb-2 border rounded p-2 w-full"
                    placeholder={p}
                    value={v}
                    rows={4}
                    onChange={(e) => s(e.target.value)}
                  />
                ) : (
                  <input
                    key={i}
                    type="text"
                    className="mb-2 border rounded p-2 w-full"
                    placeholder={p}
                    value={v}
                    onChange={(e) => s(e.target.value)}
                  />
                )
              )}

              <input
                className="mb-4 block w-full border px-3 py-2 file:bg-neutral-100 hover:file:bg-neutral-200"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                type="submit"
                disabled={!file}
                className="bg-blue-700 text-white py-2 px-5 rounded disabled:opacity-50"
              >
                送信
              </button>
            </form>

            {status && <p className="text-green-600">{status}</p>}
          </div>
        </>
      ) : (
        <>
          <h1>ログインしてください</h1>
        </>
      )}
    </>
  );
}
