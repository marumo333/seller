// app/shopEdit/[id]/page.tsx
import dynamic from "next/dynamic";

const ShopEditForm = dynamic(() => import("./shopEditForm"), { ssr: false });

export default async function Page({ params }: { params: { id: string } }) {
  return <ShopEditForm id={params.id} />;
}
