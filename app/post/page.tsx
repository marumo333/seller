"use client";

import { useState, ChangeEvent } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { v4 as uuid4 } from "uuid";

interface Props {
  onUploadComplete: () => void;
}

export default function Post({ onUploadComplete }: Props) {
  const [name, setName] = useState("");
  const [jan, setJan] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [stock, setStock] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !file.type.match("image.*")) return alert("画像ファイルを選択してください");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return alert("ログインしてください");

    const fileName = `${uuid4()}.${file.name.split(".").pop()}`;
    const filePath = `img/${fileName}`;
    const { error: uploadError } = await supabase.storage.from("shopposts").upload(filePath, file);

    if (uploadError) {
      alert("アップロード失敗: " + uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("shopposts").getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase.from("shopposts").insert([
      { name, image_url: publicUrl, url: publicUrl, jan, content, tag, stock, price },
    ]);

    if (insertError) {
      alert("登録失敗: " + insertError.message);
      return;
    }

    setFile(null);
    onUploadComplete();
  };

  return (
    <form className="mb-4 text-center" onSubmit={onSubmit}>
      {/* 各入力フォーム */}
      {[
        { value: name, setter: setName, placeholder: "商品名" },
        { value: jan, setter: setJan, placeholder: "JANコード" },
        { value: content, setter: setContent, placeholder: "内容" },
        { value: tag, setter: setTag, placeholder: "タグ" },
        { value: stock, setter: setStock, placeholder: "在庫" },
        { value: price, setter: setPrice, placeholder: "価格（税抜）" },
      ].map(({ value, setter, placeholder }, idx) => (
        <input
          key={idx}
          type="text"
          className="mb-2 border rounded p-2 w-full"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setter(e.target.value)}
        />
      ))}

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
  );
}
