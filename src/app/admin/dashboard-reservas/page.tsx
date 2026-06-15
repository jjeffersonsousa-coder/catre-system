'use client'
import { useEffect, useState } from 'react'
import { CalendarCheck, Clock, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type ReservaRecente = { id: string; nome: string; igreja: string; tipo_evento: string; data_inicio: string; data_fim: string; hospedes: number; status: string }

const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
  pendente: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB' },
  confirmada: { label: 'Confirmada', color: '#059669', bg: '#ECFDF5' },
  cancelada: { label: 'Cancelada', color: '#DC2626', bg: '#FEF2F2' },
  concluida: { label: 'Concluída', color: '#6B7280', bg: '#F9FAFB' },
}

function fmt(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

export default function DashboardReservas() {
  const [stats, setStats] = useState({ pendentes: 0, confirmadas: 0, canceladas: 0, concluidas: 0, totalHospedes: 0 })
  const [proximas, setProximas] = useState<ReservaRecente[]>([])
  const [recentes, setRecentes] = useState<ReservaRecente[]>([])

  useEffect(() => {
    const sb = createSupabaseBrowser()
    async function load() {
      const hoje = new Date().toISOString().split('T')[0]
      const [r1, r2, r3, r4, r5, r6] = await Promise.all([
        sb.from('reservas').select('id', { count: 'exact', head: true }).eq('status', 'pendente'),
        sb.from('reservas').select('id', { count: 'exact', head: true }).eq('status', 'confirmada'),
        sb.from('reservas').select('id', { count: 'exact', head: true }).eq('status', 'cancelada'),
        sb.from('reservas').select('id', { count: 'exact', head: true }).eq('status', 'concluida'),
        sb.from('reservas').select('id, nome, igreja, tipo_evento, data_inicio, data_fim, hospedes, status')
          .eq('status', 'confirmada').gte('data_inicio', hoje).order('data_inicio').limit(5),
        sb.from('reservas').select('id, nome, igreja, tipo_evento, data_inicio, data_fim, hospedes, status')
          .order('created_at', { ascending: false }).limit(5),
      ])
      // total hóspedes de reservas confirmadas
      const { data: hData } = await sb.from('reservas').select('hospedes').eq('status', 'confirmada')
      const totalH = (hData ?? []).reduce((s, r) => s + (r.hospedes ?? 0), 0)
      setStats({ pendentes: r1.count ?? 0, confirmadas: r2.count ?? 0, canceladas: r3.count ?? 0, concluidas: r4.count ?? 0, totalHospedes: totalH })
      setProximas((r5.data ?? []) as ReservaRecente[])
      setRecentes((r6.data ?? []) as ReservaRecente[])
    }
    load()
  }, [])

  const cards = [
    { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: '#D97706', bg: '#FFFBEB', href: '/admin/solicitacoes' },
    { label: 'Confirmadas', value: stats.confirmadas, icon: CheckCircle, color: '#059669', bg: '#ECFDF5', href: '/admin/reservas' },
    { label: 'Canceladas', value: stats.canceladas, icon: XCircle, color: '#DC2626', bg: '#FEF2F2', href: '/admin/solicitacoes' },
    { label: 'Hóspedes Confirmados', value: stats.totalHospedes, icon: Users, color: '#7C3AED', bg: '#F5F3FF', href: '/admin/reservas' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Dashboard — Reservas</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: '#13293D' }}>{value}</div>
            <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Próximas reservas */}
        <div className="rounded-xl" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: '#13293D' }}>
              <CalendarCheck size={17} style={{ color: '#059669' }} /> Próximas Chegadas
            </h2>
            <Link href="/admin/reservas" className="text-xs font-semibold" style={{ color: '#006494' }}>Ver agenda →</Link>
          </div>
          {proximas.length === 0 ? (
            <div className="p-10 text-center text-sm" style={{ color: '#9CA3AF' }}>Nenhuma reserva confirmada futura.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {proximas.map(r => (
                <div key={r.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: '#006494' }}>
                    {new Date(r.data_inicio + 'T00:00:00').getDate()}
                    <br />
                    <span className="text-[9px] opacity-80">{new Date(r.data_inicio + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#13293D' }}>{r.nome}</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>{r.tipo_evento} · {r.hospedes} pessoas · {fmt(r.data_inicio)} → {fmt(r.data_fim)}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0" style={{ background: statusCfg[r.status]?.bg, color: statusCfg[r.status]?.color }}>
                    {statusCfg[r.status]?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recentes */}
        <div className="rounded-xl" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: '#13293D' }}>
              <TrendingUp size={17} style={{ color: '#7C3AED' }} /> Últimas Solicitações
            </h2>
            <Link href="/admin/solicitacoes" className="text-xs font-semibold" style={{ color: '#006494' }}>Ver todas →</Link>
          </div>
          {recentes.length === 0 ? (
            <div className="p-10 text-center text-sm" style={{ color: '#9CA3AF' }}>Nenhuma solicitação recebida.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentes.map(r => {
                const sc = statusCfg[r.status] ?? statusCfg.pendente
                return (
                  <div key={r.id} className="px-6 py-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: '#13293D' }}>{r.nome}</div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>{r.igreja} · {r.hospedes} pessoas</div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0" style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { href: '/admin/solicitacoes', label: '📋 Ver Solicitações Pendentes', primary: true },
          { href: '/admin/reservas', label: '📅 Agenda de Reservas', primary: false },
          { href: '/admin/bloqueios', label: '🚫 Gerenciar Bloqueios', primary: false },
        ].map(a => (
          <Link key={a.href} href={a.href} className="flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={a.primary ? { background: '#006494', color: 'white' } : { color: '#374151', border: '1px solid #E5E7EB', background: 'white' }}>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
