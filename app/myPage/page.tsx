"use client"
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/utils/supabase/supabase";
import { useSelector} from "react-redux";
import Compressor from "compressorjs";

interface Prof {
    id: string,
    avatar_url: string,
    updated_at: string,
    full_name: string
}

export default function Mypage() {
    const [myprof, setMyprof] = useState<Prof>({
        id: "",
        avatar_url: "",
        updated_at: "",
        full_name: "",
    });

    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")
    const auth = useSelector((state: any) => state.auth.isSignIn);
    const [userId, setUserId] = useState<string>('');
    const [isClient, setIsClient] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState("")//ログイン情報を保持するステート
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                console.log("ユーザー情報を取得できませんでした", error);
                return;
            }
            const uid = data.user.id;
            setUserId(uid);
            await getUser(uid);
        };
        fetchUser();
    }, []);
    const getUser = async (userId: string) => {
        if (!userId) return;

        const { data, error } = await supabase
            .from("users")
            .select("id, username, avatar_url, updated_at, full_name")
            .eq("id", userId) // ユーザーごとのデータのみ取得
            .order("updated_at", { ascending: false })
            .limit(1); // 1件のみ取得

        if (error) {
            console.error("fetching error", error);
        } else if (data.length > 0) {
            setAvatarUrl(data[0].avatar_url); //最新のアイコン URL をセット
            setMyprof(data[0]);
        }

    };

    useEffect(() => {
        if (userId) {
            getUser(userId);
        }
    }, [userId])

    const profSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(myprof)
        console.log(userId)
        if (!myprof || !userId) {
            alert("ログインしてください")
            return;
        }
        const { data, error } = await supabase
            .from('users')
            .upsert(
                { id: userId, full_name: myprof.full_name },
                { onConflict: 'id' }//idが重複していたら更新
            );
        if (error) console.error('Error submitting comment', error);
        else {
            setMyprof(myprof);
        }
        getUser(userId);//ユーザー情報を再取得
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] // 選択したファイルを保存
        if (!selectedFile) return;

        // 画像を圧縮する
        new Compressor(selectedFile, {
            quality: 0.8, // 圧縮率
            maxWidth: 100,
            maxHeight: 100,
            mimeType: 'image/jpeg',
            success: (compressedResult) => {
                if (compressedResult instanceof Blob) {
                    setFile(new File([compressedResult], selectedFile.name, { type: "image/jpeg" }));
                }
            },
            error: (err) => {
                console.error(err.message);
                setError("画像の圧縮中にエラーが発生しました。");
            },
        });
    };
    const updateChange = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (!file || !userId) {
            alert("画像を選択してください");
            return;
        }

        const filePath = `avatars/${userId}_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, { contentType: "image/jpeg" });

        if (uploadError) {
            console.error("画像アップロードエラー", uploadError);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        const publicUrl = data?.publicUrl || "";

        if (!publicUrl) {
            console.error("画像の URL を取得できませんでした。");
            return;
        }

        const { error: updateError } = await supabase
            .from("users")
            .update({ avatar_url: publicUrl })
            .eq("id", userId);

        if (!updateError) {
            setAvatarUrl(publicUrl);
        }

        await getUser(userId);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <h1>読み込み中...</h1>; // 初回SSR時にはクライアントでレンダリングするまでプレースホルダーを表示
    }

    return (
        <>
            {userId ? (
                <>
                    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                        <div
                            className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem] pointer-events-none"
                            aria-hidden="true"
                        >

                            <div
                                className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                                style={{
                                    clipPath:
                                        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                                }}
                            />
                        </div>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                My Page
                            </h2>
                            <p className="mt-2 text-lg text-gray-600">Update your profile information</p>
                        </div>

                        <form onSubmit={profSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="myprof" className="block text-sm font-semibold text-gray-900">
                                        Username
                                    </label>
                                    <div className="mt-2.5">
                                        <textarea
                                            value={myprof?.full_name ?? ""}
                                            id="myprof"
                                            name="myprof"
                                            placeholder="write your username"
                                            onChange={(e) => {
                                                setMyprof((prev) => ({
                                                    id: prev?.id || "",
                                                    avatar_url: prev?.avatar_url || "",
                                                    updated_at: prev?.updated_at || "",
                                                    full_name: e.target.value,
                                                }));
                                            }}
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-900">Avatar Image</label>
                                    <div className="mt-2.5">
                                        <input
                                            accept="image/*"
                                            multiple
                                            type="file"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={updateChange}
                                        className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        アイコンを更新
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10">
                                <button
                                    type="submit"
                                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    ユーザー情報を更新
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 mx-auto max-w-xl border border-gray-200 rounded-md p-6">
                            <p className="text-blue-500 text-center">{myprof?.full_name || "No Username"}</p>
                            {avatarUrl && (
                                <img
                                    src={avatarUrl}
                                    className="mx-auto mt-4 w-24 h-24 rounded-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                </>
            ) : (
                <h1>ユーザー情報を取得してください</h1>
            )}
        </>
    )
}