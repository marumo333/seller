"use client";

import { supabase } from "@/utils/supabase/supabase";
import "../globals.css"
import { signOut } from "../authSlice";
import { signIn } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import Icon from "./Icon";
import { useRouter } from "next/navigation";

//onAuthChangeをuseEffectに挿入
export default function Github() {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const [user, setUser] = useState("")//ログイン情報を保持するステート
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // URLを保存する状態
  const router = useRouter();
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event)
        if (session?.user) {
          setUser(session.user.email || "Google User")
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
          setUser("")//user情報をリセット
          dispatch(signOut());
        }
      }
    );
    //クリーンアップ処理追加（リスナー削除）
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      router.push("/private")
    }
  }, [user, router])

  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `http://localhost:3000/redirect`,
      },
    })
    router.push("/private")
    if (error) throw new Error(error.message)
  }

  const signOutGoogle = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error(error.message)
      dispatch(signOut());
    }
    catch (error: any) {
      console.error("ログアウトエラー発生", error.message)
    }
  }

  useEffect(() => {
    

    const fetchAvatarUrl = async () => {
      const { data } = supabase.storage.from("avatars").getPublicUrl("github.jpg");
      setAvatarUrl(data.publicUrl || "");
    };

    fetchAvatarUrl();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-screen bg-gray-100">
      <button onClick={signInGoogle} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg">Githubでログイン</button>
      {user ? (
        <button
          onClick={signOutGoogle}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
          googleでログアウト
        </button>
      ) : (
        <div className="text-gray-500" color="blue"><p>ログイン情報を取得中:</p></div>
      )
      }
        <Icon url={avatarUrl} />
        <div className="text-gray-500" color="green"><span>ログインしてください</span></div>
    </div>
  )
}