"use client"
import { Burger, Drawer } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Link from "next/link"

export default function MobileComponent({ className }: { className?: string }) {
    const [isHamburgerOpened, { close: hamburgerClose, toggle: hamburgerToggle },] = useDisclosure(false)
    return (
        <>
            <header className="fixed z-20 flex w-full gap-y-2 bg-blue-500 p-4 text-white shadow">
                <div className="flex w-full justify-between">
                    <div className="flex w-full justify-between">
                        <div>
                            <Burger
                                opened={isHamburgerOpened}
                                onClick={hamburgerToggle}
                                color="#fff"
                            />
                            <Drawer
                                opened={isHamburgerOpened}
                                onClose={hamburgerClose}
                                zIndex={1000} // ← これがポイント
                                withCloseButton={false}
                                classNames={{
                                    body: "p-0",
                                    inner: "w-[380px]",
                                }}
                            >
                                <div className="px-4 pt-[78px] font-bold flex flex-col gap-4">
                                    <Link href="/logout" className="mb-4">ログアウト</Link>
                                    <Link href="/private" className="mb-4">商品一覧</Link>
                                    <Link href="/myPage" className="mb-4">マイページ</Link>
                                    <Link href="/stockInfo" className="mb-4">在庫情報</Link>
                                </div>
                            </Drawer>
                        </div>
                        <Link href="/" className="text-xl font-bold text-white">
                            Seller
                        </Link>
                    </div>
                </div >
            </header >
        </>
    );
};