import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin — CATRE Penedo',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#F5F7FA' }}>
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  )
}
