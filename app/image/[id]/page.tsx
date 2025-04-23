import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic'; // ← これは Next.js 用

const ClientImagePage = dynamicImport(() => import('./clientImagePage'), {
  ssr: false,
});

export default function Page({ params }: { params: { id: string } }) {
  return <ClientImagePage id={params.id} />;
}
