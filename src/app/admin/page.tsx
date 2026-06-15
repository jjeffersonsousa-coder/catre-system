'use client'
import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Wrench, CalendarCheck, UtensilsCrossed, BanIcon, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Stats = {
  reservasPendentes: number
  chamadosAbertos: number
  preventivaPendente: number
  bloqueiosAtivos: number
}

type Reserva = {
  id: string
  nome: string
  tipo_evento: string
  data_inicio: string
  data_fim: string
  hospedes: number
  status: string
  created_at: string
}

type Chamado = {
  id: string
  local: string
  descricao: string
  prioridade: string
  status: string
  created_at: string
}

const statusColor: Record<string, string> = {
  pendente: '#F59E0B',
  confirmada: '#22C55E',
  cancelada: '#EF4444',
  concluida: '#6B7280',
}
const statusLabel: Record<string, string> = {
  pendente: 'Pendente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  concluida: 'Concluída',
}
const prioridadeColor: Record<string, string> = {
  baixa: '#22C55E',
  media: '#F59E0B',
  alta: '#F97316',
  urgente: '#EF4444',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ reservasPendentes: 0, chamadosAbertos: 0, preventivaPendente: 0, bloqueiosAtivos: 0 })
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [chamados, setChamados] = useState<Chamado[]>([])

  useEffect(() => {
    const sb = createSupabaseBrowser()
    async function load() {
      const [r1, r2, r3, r4, r5, r6] = await Promise.all([
        sb.from('reservas').select('id', { count: 'exact', head: true }).eq('status', 'pendente'),
        sb.from('manutencao_chamados').select('id', { count: 'exact', head: true }).in('status', ['aberto', 'em_analise', 'em_execucao']),
        sb.from('manutencao_preventiva').select('id', { count: 'exact', head: true }).eq('concluido', false),
        sb.from('bloqueios').select('id', { count: 'exact', head: true }).eq('ativo', true),
        sb.from('reservas').select('id, nome, tipo_evento, data_inicio, data_fim, hospedes, status, created_at').order('created_at', { ascending: false }).limit(5),
        sb.from('manutencao_chamados').select('id, local, descricao, prioridade, status, created_at').order('created_at', { ascending: false }).limit(4),
      ])
      setStats({
        reservasPendentes: r1.count ?? 0,
        chamadosAbertos: r2.count ?? 0,
        preventivaPendente: r3.count ?? 0,
        bloqueiosAtivos: r4.count ?? 0,
      })
      setReservas((r5.data ?? []) as Reserva[])
      setChamados((r6.data ?? []) as Chamado[])
    }
    load()
  }, [])

  const cards = [
    { label: 'Solicitações Pendentes', value: stats.reservasPendentes, icon: ClipboardList, color: '#F59E0B', bg: '#FFFBEB', href: '/admin/reservas' },
    { label: 'Chamados Abertos', value: stats.chamadosAbertos, icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', href: '/admin/manutencao' },
    { label: 'Preventivas Pendentes', value: stats.preventivaPendente, icon: Clock, color: '#3B82F6', bg: '#EFF6FF', href: '/admin/manutencao/preventiva' },
    { label: 'Bloqueios Ativos', value: stats.bloqueiosAtivos, icon: BanIcon, color: '#8B5CF6', bg: '#F5F3FF', href: '/admin/bloqueios' },
  ]

  const acoes = [
    { href: '/admin/reservas', label: '📋 Solicitações de Reserva', cor: '#006494' },
    { href: '/admin/manutencao/novo', label: '🔧 Abrir Chamado de Manutenção', cor: null },
    { href: '/admin/cardapio', label: '🍽️ Gerenciar Cardápio', cor: null },
    { href: '/admin/bloqueios', label: '🚫 Bloquear Quarto / Data', cor: null },
    { href: '/admin/manutencao/preventiva', label: '🗓️ Manutenção Preventiva', cor: null },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: bg }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: '#13293D' }}>{value}</div>
            <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reservas recentes */}
        <div className="lg:col-span-2 rounded-xl" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: '#13293D' }}>
              <CalendarCheck size={18} style={{ color: '#006494' }} />
              Últimas Solicitações
            </h2>
            <Link href="/admin/reservas" className="text-xs font-semibold" style={{ color: '#006494' }}>
              Ver todas →
            </Link>
          </div>
          {reservas.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm" style={{ color: '#9CA3AF' }}>
              Nenhuma solicitação ainda.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reservas.map(r => (
                <div key={r.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#13293D' }}>{r.nome}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                      {r.tipo_evento} · {r.hospedes} pessoas · {new Date(r.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')} – {new Date(r.data_fim + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
                    style={{ background: `${statusColor[r.status]}18`, color: statusColor[r.status] }}
                  >
                    {statusLabel[r.status]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Chamados */}
          <div className="px-6 py-4 border-t border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: '#13293D' }}>
              <Wrench size={18} style={{ color: '#EF4444' }} />
              Chamados Recentes
            </h2>
            <Link href="/admin/manutencao" className="text-xs font-semibold" style={{ color: '#006494' }}>
              Ver todos →
            </Link>
          </div>
          {chamados.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm" style={{ color: '#9CA3AF' }}>
              Nenhum chamado aberto.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {chamados.map(c => (
                <div key={c.id} className="px-6 py-3 flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: prioridadeColor[c.prioridade] ?? '#9CA3AF' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate" style={{ color: '#13293D' }}>{c.local} — {c.descricao}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F3F4F6', color: '#374151' }}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ações rápidas */}
        <div className="rounded-xl" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold" style={{ color: '#13293D' }}>Ações Rápidas</h2>
          </div>
          <div className="p-4 space-y-2.5">
            {acoes.map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={a.cor
                  ? { background: a.cor, color: 'white' }
                  : { color: '#374151', border: '1px solid #F3F4F6', background: '#FAFAFA' }
                }
              >
                {a.label}
              </Link>
            ))}
          </div>

          {/* Módulos */}
          <div className="px-6 pb-5 pt-2">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Módulos</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/admin/reservas', icon: ClipboardList, label: 'Reservas' },
                { href: '/admin/manutencao', icon: Wrench, label: 'Manutenção' },
                { href: '/admin/cardapio', icon: UtensilsCrossed, label: 'Cardápio' },
                { href: '/admin/bloqueios', icon: BanIcon, label: 'Bloqueios' },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:border-blue-300 hover:bg-blue-50"
                  style={{ borderColor: '#F3F4F6' }}
                >
                  <Icon size={18} style={{ color: '#006494' }} />
                  <span className="text-xs font-medium" style={{ color: '#374151' }}>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
