'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Wrench, CalendarCheck, Users, Settings,
  Home, ChevronRight, LogOut, UtensilsCrossed, BanIcon,
  ClipboardList, Building2, CalendarDays,
} from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

const navGroups = [
  {
    label: 'Dashboards',
    items: [
      { href: '/admin', label: 'Dashboard — Manutenção', icon: LayoutDashboard, exact: true },
      { href: '/admin/dashboard-reservas', label: 'Dashboard — Reservas', icon: CalendarDays, exact: true },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { href: '/admin/solicitacoes', label: 'Solicitações', icon: ClipboardList, exact: false },
      { href: '/admin/reservas', label: 'Reservas', icon: CalendarCheck, exact: false },
      { href: '/admin/cardapio', label: 'Cardápio', icon: UtensilsCrossed, exact: false },
      { href: '/admin/bloqueios', label: 'Bloqueios', icon: BanIcon, exact: false },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { href: '/admin/manutencao', label: 'Manutenção', icon: Wrench, exact: false },
      { href: '/admin/chamados', label: 'Chamados de Hóspedes', icon: ClipboardList, exact: false },
      { href: '/admin/ambientes', label: 'Ambientes', icon: Building2, exact: false },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/admin/usuarios', label: 'Usuários', icon: Users, exact: false },
      { href: '/admin/configuracoes', label: 'Configurações', icon: Settings, exact: false },
    ],
  },
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

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen" style={{ background: '#13293D' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: '#006494' }}>
            ARS
          </div>
          <div>
            <div className="text-white font-bold text-sm">CATRE</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Administração</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="text-xs font-bold uppercase tracking-widest px-3 mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href, item.exact)
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
                    <Icon size={16} />
                    <span className="truncate">{item.label}</span>
                    {active && <ChevronRight size={13} className="ml-auto opacity-50 flex-shrink-0" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <Home size={16} /> Ver Site Público
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-red-500/10" style={{ color: 'rgba(255,100,100,0.7)' }}>
          <LogOut size={16} /> Sair
        </button>
      </div>
    </aside>
  )
}
