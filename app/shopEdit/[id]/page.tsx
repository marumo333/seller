// app/shopEdit/[id]/page.tsx
import ShopEditForm from "./shopEditForm";

export default function Page({ params }: { params: { id: string } }) {
  return <ShopEditForm id={params.id} />;
}
