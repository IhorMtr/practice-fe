import ClientsGuard from '@/components/ClientsGuard/ClientsGuard';

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientsGuard />
      {children}
    </>
  );
}
