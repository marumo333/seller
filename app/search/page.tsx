"use client"
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase/supabase";
import Head from "next/head";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { signOut, signIn } from "../authSlice";
import { Skeleton } from '@mui/material'
import { useCallback } from "react";

interface ImageItem {
    id: string;
    name: string;
    url: string;
    jan: number;
    content: string;
    tag: string,
    stock: number,
    price: number,
}


export default function Search() {
    const auth = useSelector((state: any) => state.auth.isSignIn);
    const dispatch = useDispatch()
    const [user, setUser] = useState("")//ログイン情報を保持するステート
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log(event)
                if (session?.user) {
                    setUser(session.user.email || "Login User")
                    dispatch(signIn({
                        name: session.user.email,
                        iconUrl: "",
                        token: session.provider_token
                    }))
                    window.localStorage.setItem('oauth_provider_token', session.provider_token || "");
                    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token || "")
                }

                if (event === 'SIGNED_OUT') {
                    window.localStorage.removeItem('oauth_provider_token')
                    window.localStorage.removeItem('oauth_provider_refresh_token')
                    dispatch(signOut());
                    setUser("")//user情報をリセット
                }
            }
        );
        //クリーンアップ処理追加（リスナー削除）
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [dispatch]);
    const [posts, setPosts] = useState<ImageItem[]>([]);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);


    async function fetchPosts() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("shopposts")
                .select("*");

            if (error) {
                console.error("データ取得エラー", error.message)
                return;
            }
            setPosts(data || []);
        } catch (err) {
            console.error("予期しないエラー", err)
        } finally {
            setLoading(false)
        }
    };

    const search = async (value: string) => {
        setLoading(true)
        try {
            if (value === "") {
                await fetchPosts();
            } else {
                const { data: posts, error } = await supabase
                    .from("shopposts")
                    .select("*")
                    .ilike("name", `%${value}%`);

                if (error) {
                    console.error("検索エラー:", error.message);
                    return;
                }
                setPosts(posts || []);
            }
        } catch (err) {
            console.error("予期しないエラー発生", err);
        }
        finally {
            setLoading(false)
        }
    };


    const debounceSearch = useMemo(() =>
        debounce((value: string) => {
            search(value);
        }, 1000),
        []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setKeyword(value);
        debounceSearch(value);
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])
    if (!isClient) {
        return <h1>読み込み中....</h1>
    }
    return (
        <>
            {auth ? (<>
                <div>
                    <Head>
                        <title>検索機能</title>
                    </Head>
                    <main className="p-6">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-2xl font-semibold mb-4">検索機能</h1>
                            <div className="flex justify-end">
                            </div>
                            <p>商品名検索</p>
                            <div>
                                <input
                                    type="text"
                                    id="search-input"
                                    name="search"
                                    value={keyword}
                                    className="my-6 w-full max-w-md p-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="検索..."
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                {loading ? (
                                    <ul className="border border-gray-300 rounded p-4">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <li
                                                key={index}
                                                className="py-4 border-b last:border-none flex justify-between items-center"
                                            >
                                                <Skeleton variant="text" width="20%" />
                                                <Skeleton variant="text" width="40%" />
                                                <Skeleton variant="rectangular" width={100} height={80} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul className="border border-gray-300 rounded p-4">
                                        <li className="font-bold border-b border-gray-300 pb-2 mb-2 flex justify-between">
                                            <p className="w-1/4">商品名</p>
                                            <p className="w-1/4">在庫数</p>
                                            <p className="w-1/4">画像</p>
                                        </li>
                                        {posts.map((post) => (
                                            <li key={post.id} className="py-4 border-b last:border-none flex justify-between items-center">
                                                <p className="w-1/4">{post.name}</p>
                                                <p className="w-1/4 font-semibold">{post.stock}</p>
                                                <div className="w-1/4">
                                                    <img
                                                        src={post.url || "https://example.com/default.jpg"}
                                                        alt={post.name}
                                                        className="w-[100px] h-[80px] object-cover rounded"
                                                        onError={(e) => (e.currentTarget.src = "https://example.com/default.jpg")}
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </>) : (<div>アカウントでログインしてください</div>)}
        </>
    )
}


