"use client";
import { supabase } from "@/utils/supabase/supabase";
import "../globals.css";
import { signOut, signIn } from "../authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import Icon from "./Icon";
import { useRouter } from "next/navigation";

export default function Github() {
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const router = useRouter();

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
          window.localStorage.setItem("oauth_provider_token", session.provider_token || "");
          window.localStorage.setItem("oauth_provider_refresh_token", session.provider_refresh_token || "");
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

  useEffect(() => {
    if (user) {
      router.push("/private");
    }
  }, [user, router]);

  const signInGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `https://seller-weld.vercel.app/redirect`,
      },
    });
    if (error) throw new Error(error.message);
  };

  const signOutGithub = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      dispatch(signOut());
    } catch (error: any) {
      console.error("ログアウトエラー発生:", error.message);
    }
  };

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      const { data } = supabase.storage.from("avatars").getPublicUrl("github.jpg"); // 小文字に変更
      setAvatarUrl(data.publicUrl || "");
    };
    fetchAvatarUrl();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-64">
      <button
        onClick={signInGithub}
        className="bg-black hover:bg-gray-800 text-white w-full"
        disabled={!!user}
      >
        GitHubでログイン
      </button>

      {user ? (
        <button
          onClick={signOutGithub}
          className="bg-gray-500 hover:bg-gray-600 text-white w-full"
        >
          ログアウト
        </button>
      ) : (
        <div className="text-sm text-gray-500">ログイン状態を確認中...</div>
      )}

      <Icon url={avatarUrl} />
      {!user && <div className="text-sm text-gray-600">ログインしてください</div>}
    </div>
  );
}
