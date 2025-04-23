import ClientImagePage from './clientImagePage';

export const dynamic = 'force-dynamic'; // SSRを強制したい場合


export default function Page({
  params,
}: {
  params: { id: string };
}) {
  return <ClientImagePage id={params.id} />;
}
