import AdminGuard from '@/components/AdminGuard/AdminGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminGuard />
      {children}
    </>
  );
}
