'use client'
import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Wrench, Activity, BanIcon } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type ChamadoRecente = { id: string; local: string; descricao: string; prioridade: string; status: string; created_at: string }
type Preventiva = { id: string; titulo: string; proximo_vencimento: string; frequencia: string; concluido: boolean }

const prioridadeColor: Record<string, string> = {
  baixa: '#22C55E', media: '#F59E0B', alta: '#F97316', urgente: '#EF4444',
}

export default function DashboardManutencao() {
  const [stats, setStats] = useState({ abertos: 0, emAndamento: 0, concluidos: 0, preventivas: 0 })
  const [chamados, setChamados] = useState<ChamadoRecente[]>([])
  const [preventivas, setPreventivas] = useState<Preventiva[]>([])

  useEffect(() => {
    const sb = createSupabaseBrowser()
    async function load() {
      const [r1, r2, r3, r4, r5, r6] = await Promise.all([
        sb.from('manutencao_chamados').select('id', { count: 'exact', head: true }).eq('status', 'aberto'),
        sb.from('manutencao_chamados').select('id', { count: 'exact', head: true }).in('status', ['em_analise', 'em_execucao']),
        sb.from('manutencao_chamados').select('id', { count: 'exact', head: true }).eq('status', 'concluido'),
        sb.from('manutencao_preventiva').select('id', { count: 'exact', head: true }).eq('concluido', false),
        sb.from('manutencao_chamados').select('id, local, descricao, prioridade, status, created_at').order('created_at', { ascending: false }).limit(6),
        sb.from('manutencao_preventiva').select('id, titulo, proximo_vencimento, frequencia, concluido').eq('concluido', false).order('proximo_vencimento').limit(5),
      ])
      setStats({ abertos: r1.count ?? 0, emAndamento: r2.count ?? 0, concluidos: r3.count ?? 0, preventivas: r4.count ?? 0 })
      setChamados((r5.data ?? []) as ChamadoRecente[])
      setPreventivas((r6.data ?? []) as Preventiva[])
    }
    load()
  }, [])

  const cards = [
    { label: 'Chamados Abertos', value: stats.abertos, icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', href: '/admin/manutencao' },
    { label: 'Em Andamento', value: stats.emAndamento, icon: Activity, color: '#F59E0B', bg: '#FFFBEB', href: '/admin/manutencao' },
    { label: 'Concluídos (total)', value: stats.concluidos, icon: CheckCircle, color: '#22C55E', bg: '#F0FDF4', href: '/admin/manutencao' },
    { label: 'Preventivas Pendentes', value: stats.preventivas, icon: Clock, color: '#3B82F6', bg: '#EFF6FF', href: '/admin/manutencao/preventiva' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Dashboard — Manutenção</h1>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chamados recentes */}
        <div className="lg:col-span-2 rounded-xl" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: '#13293D' }}>
              <Wrench size={17} style={{ color: '#EF4444' }} /> Chamados Recentes
            </h2>
            <Link href="/admin/manutencao" className="text-xs font-semibold" style={{ color: '#006494' }}>Ver todos →</Link>
          </div>
          {chamados.length === 0 ? (
            <div className="p-10 text-center text-sm" style={{ color: '#9CA3AF' }}>Nenhum chamado aberto.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {chamados.map(c => (
                <div key={c.id} className="px-6 py-3.5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: prioridadeColor[c.prioridade] ?? '#9CA3AF' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#13293D' }}>{c.local} — {c.descricao}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#F3F4F6', color: '#374151' }}>
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preventivas e Ações rápidas */}
        <div className="space-y-4">
          <div className="rounded-xl" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
              <h2 className="font-bold text-sm flex items-center gap-2" style={{ color: '#13293D' }}>
                <Clock size={16} style={{ color: '#3B82F6' }} /> Preventivas Pendentes
              </h2>
              <Link href="/admin/manutencao/preventiva" className="text-xs font-semibold" style={{ color: '#006494' }}>Ver →</Link>
            </div>
            {preventivas.length === 0 ? (
              <div className="p-6 text-center text-sm" style={{ color: '#9CA3AF' }}>Tudo em dia!</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {preventivas.map(p => (
                  <div key={p.id} className="px-5 py-3">
                    <div className="text-sm font-medium" style={{ color: '#13293D' }}>{p.titulo}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                      Vence: {new Date(p.proximo_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')} · {p.frequencia}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl p-4 space-y-2" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Ações Rápidas</div>
            {[
              { href: '/admin/manutencao/novo', label: '🔧 Abrir Chamado', primary: true },
              { href: '/admin/manutencao/preventiva', label: '🗓️ Manutenção Preventiva', primary: false },
              { href: '/admin/ambientes', label: '🏠 Gerenciar Ambientes', primary: false },
              { href: '/admin/bloqueios', label: '🚫 Bloqueios de Quartos', primary: false },
            ].map(a => (
              <Link key={a.href} href={a.href} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={a.primary ? { background: '#006494', color: 'white' } : { color: '#374151', border: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
