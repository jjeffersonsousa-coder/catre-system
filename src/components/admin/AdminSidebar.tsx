'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  Users,
  Settings,
  Home,
  ChevronRight,
  LogOut,
  UtensilsCrossed,
  BanIcon,
  ClipboardList,
} from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/reservas', label: 'Solicitações', icon: ClipboardList, exact: false },
  { href: '/admin/manutencao', label: 'Manutenção', icon: Wrench, exact: false },
  { href: '/admin/cardapio', label: 'Cardápio', icon: UtensilsCrossed, exact: false },
  { href: '/admin/bloqueios', label: 'Bloqueios', icon: BanIcon, exact: false },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users, exact: false },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings, exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside
      className="hidden md:flex flex-col w-60 min-h-screen"
      style={{ background: '#13293D' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link href="/admin" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ background: '#006494' }}
          >
            ARS
          </div>
          <div>
            <div className="text-white font-bold text-sm">CATRE</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Administração</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(0,100,148,0.35)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                borderLeft: active ? '3px solid #4D9FBF' : '3px solid transparent',
              }}
            >
              <Icon size={17} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <Home size={16} />
          Ver Site Público
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-500/10"
          style={{ color: 'rgba(255,100,100,0.7)' }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
