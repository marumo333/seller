// app/image/[id]/page.tsx
import ClientImagePage from './clientImagePage';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { id: string } }) {
  return <ClientImagePage id={params.id} />;
}
