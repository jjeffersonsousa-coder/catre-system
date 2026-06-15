import { AlertTriangle, CheckCircle, Clock, Wrench, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Chamados Abertos', value: '3', icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2' },
  { label: 'Em Andamento', value: '5', icon: Activity, color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Concluídos (mês)', value: '12', icon: CheckCircle, color: '#22C55E', bg: '#F0FDF4' },
  { label: 'Preventivas Pendentes', value: '2', icon: Clock, color: '#3B82F6', bg: '#EFF6FF' },
]

const chamadosRecentes = [
  { id: '001', local: 'Quarto 12', desc: 'Torneira com vazamento', prioridade: 'alta', status: 'Em Execução', data: '14/06/2026' },
  { id: '002', local: 'Piscina', desc: 'Bomba com barulho estranho', prioridade: 'urgente', status: 'Aberto', data: '14/06/2026' },
  { id: '003', local: 'Auditório Central', desc: 'Ar condicionado não resfria', prioridade: 'media', status: 'Em Análise', data: '13/06/2026' },
  { id: '004', local: 'Restaurante', desc: 'Lâmpada queimada cozinha', prioridade: 'baixa', status: 'Em Execução', data: '12/06/2026' },
]

const prioridadeColor: Record<string, string> = {
  baixa: '#22C55E',
  media: '#F59E0B',
  alta: '#F97316',
  urgente: '#EF4444',
}

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          Visão geral do CATRE Penedo — {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-xl p-5"
              style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: s.bg }}
                >
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <TrendingUp size={14} style={{ color: '#D1D5DB' }} />
              </div>
              <div className="text-3xl font-bold" style={{ color: '#13293D' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chamados recentes */}
        <div
          className="lg:col-span-2 rounded-xl"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold" style={{ color: '#13293D' }}>Chamados Recentes</h2>
            <Link href="/admin/manutencao" className="text-xs font-medium" style={{ color: '#006494' }}>
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {chamadosRecentes.map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: prioridadeColor[c.prioridade] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: '#13293D' }}>
                    {c.local} — {c.desc}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{c.data}</div>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={{
                    background: '#F3F4F6',
                    color: '#374151',
                  }}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações rápidas */}
        <div
          className="rounded-xl"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
            <h2 className="font-bold" style={{ color: '#13293D' }}>Ações Rápidas</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/admin/manutencao/novo"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:opacity-90"
              style={{ background: '#006494', color: 'white' }}
            >
              <Wrench size={18} />
              <span className="text-sm font-medium">Abrir Chamado</span>
            </Link>

            {[
              { href: '/admin/manutencao', label: '📋 Ver Todos os Chamados' },
              { href: '/admin/manutencao/preventiva', label: '🗓️ Manutenção Preventiva' },
              { href: '/admin/reservas', label: '📅 Gerenciar Reservas' },
              { href: '/admin/relatorios', label: '📊 Gerar Relatório' },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 p-3 rounded-lg text-sm transition-all hover:bg-gray-50"
                style={{ color: '#374151', border: '1px solid #F3F4F6' }}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
