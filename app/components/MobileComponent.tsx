"use client"
import { signIn, signOut } from "@/app/authSlice"
import { supabase } from "@/utils/supabase/supabase"
import { Burger, Drawer } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export default function MobileComponent({ className }: { className?: string }) {
    const [opened, handlers] = useDisclosure(false);
    const { close, toggle } = handlers;

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
    return (
        <>{
            user ? (
                <header className="fixed top-0 left-0 right-0 z-50 bg-blue-500 p-4 text-white shadow">
                    <div className="flex w-full justify-between">
                        <div className="flex w-full justify-between">
                            <div>
                                <Burger
                                    opened={opened}
                                    //onClick={hamburgerToggle}
                                    onClick={() => {
                                        console.log("toggle");
                                        toggle();
                                    }
                                    }
                                //toggleが発火shている確認
                                />
                                <Drawer
                                    opened={opened}
                                    onClose={close}
                                    zIndex={9999}
                                    withCloseButton={false}
                                    classNames={{
                                        body: "p-0",
                                        inner: "w-[380px]",
                                    }}
                                >
                                    <div className="px-4 pt-[78px] font-bold flex flex-col gap-4">
                                        <Link href="/logout" className="mb-4" onClick={close}>ログアウト</Link>
                                        <Link href="/private" className="mb-4" onClick={close}>商品一覧</Link>
                                        <Link href="/myPage" className="mb-4" onClick={close}>マイページ</Link>
                                        <Link href="/stockInfo" className="mb-4" onClick={close}>在庫情報</Link>
                                        <Link href="/post" className="mb-4" onClick={close}>商品を投稿</Link>
                                    </div>
                                </Drawer>

                            </div>
                            <Link href="/" className="text-xl font-bold text-white">
                                Seller
                            </Link>
                        </div>
                    </div >
                </header >
            ) : (
                <header className="fixed top-0 left-0 right-0 z-50 bg-blue-500 p-4 text-white shadow">
                    <div className="flex w-full justify-between">
                        <div className="flex w-full justify-between">
                            <div>
                                <Burger
                                    opened={opened}
                                    onClick={() => {
                                        console.log("toggle")
                                        toggle();
                                    }}
                                    color="#fff"
                                />
                                <Drawer
                                    opened={opened}
                                    onClose={close}
                                    zIndex={9999} // ← これがポイント
                                    withCloseButton={false}
                                    classNames={{
                                        body: "p-0",
                                        inner: "w-[380px]",
                                    }}
                                >
                                    <div className="px-4 pt-[78px] font-bold flex flex-col gap-4">
                                        <Link href="/private" className="mb-4" onClick={close}>商品一覧</Link>
                                        <Link href="/myPage" className="mb-4" onClick={close}>マイページ</Link>
                                        <Link href="/stockInfo" className="mb-4" onClick={close}>在庫情報</Link>
                                        <Link href="/post" className="mb-4" onClick={close}>商品を投稿</Link>
                                    </div>
                                </Drawer>
                            </div>
                            <Link href="/" className="text-xl font-bold text-white">
                                Seller
                            </Link>
                        </div>
                    </div >
                </header >
            )
        }
        </>
    );
};