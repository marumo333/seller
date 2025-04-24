// app/shopEdit/[id]/page.tsx
import ShopEditForm from "./shopEditForm"; // ← 正しい大文字小文字で！

export default function Page({ params }: { params: { id: string } }) {
  return <ShopEditForm id={params.id} />;
}

export async function generateStaticParams() {
  return [];
}
