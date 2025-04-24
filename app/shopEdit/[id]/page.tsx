//app/shopEdit/[id]/page.tsx
import ShopEditForm from "./ShopEditForm";

export default function Page({ params }: { params: { id: string } }) {
  return <ShopEditForm id={params.id} />;
}

// 👇 これを追加して、Next.js に params の解決方法を明示する
export async function generateStaticParams() {
  return []; //（fallback: blocking 相当）
}
