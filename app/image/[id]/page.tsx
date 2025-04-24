import ImageClient from "./ImageClient";

export default async function Page({ params }: { params: { id: string } }) {
  return <ImageClient id={params.id} />;
}

export async function generateStaticParams() {
  return [];
}

