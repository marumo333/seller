// app/shopEdit/[id]/page.tsx

import ShopEditForm from "./shopEditForm";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <ShopEditForm id={params.id} />;
}
