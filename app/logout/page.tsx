"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase";
import { signOut, signIn } from "../authSlice";

export default function Logout() {
  const dispatch = useDispatch();
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const router = useRouter();

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

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      dispatch(signOut());
      router.push("/");
    } catch (error: any) {
      console.error("ログアウトエラー発生", error.message);
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        ローディング中...
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div
          className="w-screen h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
          style={{ backgroundImage: "url('/logout.png')" }}
        >
          {/* オーバーレイ（画像を少し暗くする） */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* 中央のダイアログ */}
          <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl text-center w-[90%] max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">ログアウトしますか？</h1>
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={logOut}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                はい
              </button>
              <button
                onClick={() => router.back()}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                いいえ
              </button>
            </div>
          </div>
        </div>


      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">ログインしていません</p>
        </div>
      )}
    </>
  );
}
