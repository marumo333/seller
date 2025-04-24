import dynamic from "next/dynamic";

// 👇 クライアントコンポーネントを動的読み込み（SSR無効）
const ImageClient = dynamic(() => import("./ImageClient"), { ssr: false });

export default function Page({ params }: { params: { id: string } }) {
  return <ImageClient id={params.id} />;
}

// 👇 型バグ防止のため generateStaticParams を削除またはこのまま
export async function generateStaticParams() {
  return [];
}
