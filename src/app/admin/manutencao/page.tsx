'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Filter, Search, AlertTriangle } from 'lucide-react'
import { PRIORIDADE_COLOR, PRIORIDADE_LABEL, STATUS_COLOR, STATUS_LABEL } from '@/lib/types'
import type { Chamado, Prioridade, StatusChamado } from '@/lib/types'

// Mock data — will be replaced with Supabase queries
const mockChamados: Chamado[] = [
  {
    id: '1', data: '2026-06-14', hora: '09:30', local: 'Quarto 12',
    categoria: 'Hidráulica', descricao: 'Torneira da pia com vazamento constante',
    prioridade: 'alta', status: 'em_execucao', responsavel: 'Marcos',
    fotos: [], created_at: '2026-06-14T09:30:00', updated_at: '2026-06-14T10:00:00',
  },
  {
    id: '2', data: '2026-06-14', hora: '14:15', local: 'Piscina',
    categoria: 'Elétrica', descricao: 'Bomba da piscina fazendo barulho anormal',
    prioridade: 'urgente', status: 'aberto', responsavel: undefined,
    fotos: [], created_at: '2026-06-14T14:15:00', updated_at: '2026-06-14T14:15:00',
  },
  {
    id: '3', data: '2026-06-13', hora: '11:00', local: 'Auditório Central',
    categoria: 'Elétrica', descricao: 'Ar condicionado não resfria adequadamente',
    prioridade: 'media', status: 'em_analise', responsavel: 'Carlos',
    fotos: [], created_at: '2026-06-13T11:00:00', updated_at: '2026-06-13T15:00:00',
  },
  {
    id: '4', data: '2026-06-12', hora: '08:00', local: 'Restaurante',
    categoria: 'Elétrica', descricao: 'Duas lâmpadas queimadas na cozinha',
    prioridade: 'baixa', status: 'em_execucao', responsavel: 'José',
    fotos: [], created_at: '2026-06-12T08:00:00', updated_at: '2026-06-12T09:00:00',
  },
  {
    id: '5', data: '2026-06-10', hora: '16:00', local: 'Quarto 07',
    categoria: 'Mobiliário', descricao: 'Beliche com parafuso solto — risco de queda',
    prioridade: 'alta', status: 'concluido', responsavel: 'Marcos',
    fotos: [], created_at: '2026-06-10T16:00:00', updated_at: '2026-06-11T10:00:00',
  },
  {
    id: '6', data: '2026-06-09', hora: '10:30', local: 'Banheiro Bloco B',
    categoria: 'Hidráulica', descricao: 'Chuveiro sem pressão',
    prioridade: 'media', status: 'concluido', responsavel: 'Carlos',
    fotos: [], created_at: '2026-06-09T10:30:00', updated_at: '2026-06-09T15:00:00',
  },
]

const statusFlow: StatusChamado[] = ['aberto', 'em_analise', 'em_execucao', 'aguardando_conferencia', 'concluido']

export default function ManutencaoPage() {
  const [chamados, setChamados] = useState<Chamado[]>(mockChamados)
  const [filtroStatus, setFiltroStatus] = useState<StatusChamado | 'todos'>('todos')
  const [filtroPrioridade, setFiltroPrioridade] = useState<Prioridade | 'todos'>('todos')
  const [busca, setBusca] = useState('')
  const [chamadoSelecionado, setChamadoSelecionado] = useState<Chamado | null>(null)

  const filtrados = chamados.filter((c) => {
    if (filtroStatus !== 'todos' && c.status !== filtroStatus) return false
    if (filtroPrioridade !== 'todos' && c.prioridade !== filtroPrioridade) return false
    if (busca && !c.local.toLowerCase().includes(busca.toLowerCase()) &&
      !c.descricao.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  })

  const avancarStatus = (id: string) => {
    setChamados(prev => prev.map(c => {
      if (c.id !== id) return c
      const idx = statusFlow.indexOf(c.status)
      if (idx === statusFlow.length - 1) return c
      return { ...c, status: statusFlow[idx + 1], updated_at: new Date().toISOString() }
    }))
  }

  // Count by status
  const contagem = statusFlow.reduce((acc, s) => {
    acc[s] = chamados.filter(c => c.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Manutenção Predial</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Controle de chamados e manutenções preventivas</p>
        </div>
        <Link
          href="/admin/manutencao/novo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#006494' }}
        >
          <Plus size={18} />
          Abrir Chamado
        </Link>
      </div>

      {/* Status pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {statusFlow.map((s) => (
          <button
            key={s}
            onClick={() => setFiltroStatus(filtroStatus === s ? 'todos' : s)}
            className="rounded-xl p-4 text-left transition-all hover:-translate-y-0.5"
            style={{
              background: filtroStatus === s ? STATUS_COLOR[s] : 'white',
              color: filtroStatus === s ? 'white' : '#13293D',
              boxShadow: '0 1px 8px rgba(19,41,61,0.08)',
              border: `2px solid ${filtroStatus === s ? STATUS_COLOR[s] : 'transparent'}`,
            }}
          >
            <div className="text-2xl font-bold">{contagem[s] ?? 0}</div>
            <div className="text-xs mt-1 opacity-80">{STATUS_LABEL[s]}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Buscar por local ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm border outline-none"
            style={{ borderColor: '#E5E7EB', color: '#13293D' }}
          />
        </div>

        <select
          value={filtroPrioridade}
          onChange={(e) => setFiltroPrioridade(e.target.value as Prioridade | 'todos')}
          className="px-3 py-2.5 rounded-lg text-sm border outline-none"
          style={{ borderColor: '#E5E7EB', color: '#13293D' }}
        >
          <option value="todos">Todas as prioridades</option>
          <option value="urgente">Urgente</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <Link
          href="/admin/manutencao/preventiva"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB', color: '#374151' }}
        >
          <Filter size={15} />
          Preventiva
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                {['#', 'Data', 'Local', 'Categoria', 'Descrição', 'Prioridade', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide" style={{ color: '#6B7280' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: '#9CA3AF' }}>
                    Nenhum chamado encontrado
                  </td>
                </tr>
              )}
              {filtrados.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: '#F3F4F6' }}
                  onClick={() => setChamadoSelecionado(c)}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#9CA3AF' }}>#{c.id.padStart(3, '0')}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#6B7280' }}>
                    {new Date(c.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#13293D' }}>{c.local}</td>
                  <td className="px-4 py-3" style={{ color: '#6B7280' }}>{c.categoria}</td>
                  <td className="px-4 py-3 max-w-[220px] truncate" style={{ color: '#374151' }}>{c.descricao}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: PRIORIDADE_COLOR[c.prioridade] }}
                    >
                      {c.prioridade === 'urgente' && <AlertTriangle size={10} />}
                      {PRIORIDADE_LABEL[c.prioridade]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: `${STATUS_COLOR[c.status]}20`, color: STATUS_COLOR[c.status] }}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {c.status !== 'concluido' && (
                      <button
                        onClick={() => avancarStatus(c.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{ background: '#E8F4F8', color: '#006494' }}
                      >
                        Avançar →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {chamadoSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setChamadoSelecionado(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: '#13293D' }}
            >
              <h3 className="text-white font-bold">Chamado #{chamadoSelecionado.id.padStart(3, '0')}</h3>
              <button onClick={() => setChamadoSelecionado(null)} className="text-white/60 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Local</div>
                  <div className="text-sm font-medium" style={{ color: '#13293D' }}>{chamadoSelecionado.local}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Categoria</div>
                  <div className="text-sm" style={{ color: '#374151' }}>{chamadoSelecionado.categoria}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Data / Hora</div>
                  <div className="text-sm" style={{ color: '#374151' }}>
                    {new Date(chamadoSelecionado.data).toLocaleDateString('pt-BR')} às {chamadoSelecionado.hora}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Responsável</div>
                  <div className="text-sm" style={{ color: '#374151' }}>{chamadoSelecionado.responsavel ?? '—'}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>Descrição</div>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{chamadoSelecionado.descricao}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: PRIORIDADE_COLOR[chamadoSelecionado.prioridade] }}
                >
                  {PRIORIDADE_LABEL[chamadoSelecionado.prioridade]}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${STATUS_COLOR[chamadoSelecionado.status]}20`, color: STATUS_COLOR[chamadoSelecionado.status] }}
                >
                  {STATUS_LABEL[chamadoSelecionado.status]}
                </span>
              </div>

              {/* Status flow */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B7280' }}>Progresso</div>
                <div className="flex items-center gap-1">
                  {statusFlow.map((s, i) => {
                    const currentIdx = statusFlow.indexOf(chamadoSelecionado.status)
                    const done = i <= currentIdx
                    return (
                      <div key={s} className="flex items-center gap-1 flex-1">
                        <div
                          className="w-full h-2 rounded-full transition-all"
                          style={{ background: done ? STATUS_COLOR[chamadoSelecionado.status] : '#E5E7EB' }}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Aberto</span>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Concluído</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {chamadoSelecionado.status !== 'concluido' && (
                  <button
                    onClick={() => {
                      avancarStatus(chamadoSelecionado.id)
                      setChamadoSelecionado(null)
                    }}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: '#006494' }}
                  >
                    Avançar Status
                  </button>
                )}
                <button
                  onClick={() => setChamadoSelecionado(null)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
