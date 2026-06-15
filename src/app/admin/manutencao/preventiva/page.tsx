'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react'

interface CheckItem {
  id: string
  titulo: string
  frequencia: 'mensal' | 'trimestral' | 'anual'
  descricao: string
  proximo: string
  concluido: boolean
}

const checklistInicial: CheckItem[] = [
  // Mensal
  { id: 'm1', titulo: 'Verificação Elétrica', frequencia: 'mensal', descricao: 'Inspecionar quadros, tomadas e disjuntores', proximo: '2026-07-01', concluido: false },
  { id: 'm2', titulo: 'Verificação Hidráulica', frequencia: 'mensal', descricao: 'Checar torneiras, registros e caixas d\'água', proximo: '2026-07-01', concluido: true },
  { id: 'm3', titulo: 'Manutenção da Piscina', frequencia: 'mensal', descricao: 'Limpeza, pH e cloro da piscina', proximo: '2026-06-20', concluido: false },
  { id: 'm4', titulo: 'Revisão de Iluminação', frequencia: 'mensal', descricao: 'Substituir lâmpadas queimadas em todos os ambientes', proximo: '2026-07-01', concluido: false },
  // Trimestral
  { id: 't1', titulo: 'Pintura e Caiação', frequencia: 'trimestral', descricao: 'Verificar desgaste e necessidade de pintura', proximo: '2026-09-01', concluido: false },
  { id: 't2', titulo: 'Revisão de Equipamentos', frequencia: 'trimestral', descricao: 'Geladeiras, ar condicionado, chuveiros e bombas', proximo: '2026-09-01', concluido: false },
  { id: 't3', titulo: 'Controle de Pragas', frequencia: 'trimestral', descricao: 'Dedetização e controle de pragas geral', proximo: '2026-09-01', concluido: true },
  // Anual
  { id: 'a1', titulo: 'Reforma Preventiva', frequencia: 'anual', descricao: 'Revisão geral das instalações e reformas necessárias', proximo: '2027-01-01', concluido: false },
  { id: 'a2', titulo: 'Revisão Estrutural', frequencia: 'anual', descricao: 'Verificação de telhado, fundação e estrutura', proximo: '2027-01-01', concluido: false },
]

const freq = ['mensal', 'trimestral', 'anual'] as const
const freqLabel = { mensal: 'Mensal', trimestral: 'Trimestral', anual: 'Anual' }
const freqColor = { mensal: '#006494', trimestral: '#8B5CF6', anual: '#F59E0B' }

export default function ManutencaoPreventiva() {
  const [itens, setItens] = useState<CheckItem[]>(checklistInicial)
  const [filtro, setFiltro] = useState<'mensal' | 'trimestral' | 'anual' | 'todos'>('todos')

  const toggle = (id: string) => {
    setItens(prev => prev.map(i => i.id === id ? { ...i, concluido: !i.concluido } : i))
  }

  const filtrados = filtro === 'todos' ? itens : itens.filter(i => i.frequencia === filtro)

  const hoje = new Date().toISOString().split('T')[0]
  const vencidos = itens.filter(i => !i.concluido && i.proximo <= hoje)
  const pendentes = itens.filter(i => !i.concluido && i.proximo > hoje)
  const concluidos = itens.filter(i => i.concluido)

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/manutencao"
          className="w-9 h-9 rounded-lg flex items-center justify-center border"
          style={{ borderColor: '#E5E7EB' }}
        >
          <ArrowLeft size={18} style={{ color: '#374151' }} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#13293D' }}>Manutenção Preventiva</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>Checklist de manutenções programadas</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertTriangle size={20} style={{ color: '#EF4444' }} className="mb-2" />
          <div className="text-2xl font-bold" style={{ color: '#DC2626' }}>{vencidos.length}</div>
          <div className="text-xs mt-0.5" style={{ color: '#EF4444' }}>Vencidas</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <Clock size={20} style={{ color: '#F59E0B' }} className="mb-2" />
          <div className="text-2xl font-bold" style={{ color: '#D97706' }}>{pendentes.length}</div>
          <div className="text-xs mt-0.5" style={{ color: '#F59E0B' }}>Pendentes</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <CheckCircle size={20} style={{ color: '#22C55E' }} className="mb-2" />
          <div className="text-2xl font-bold" style={{ color: '#16A34A' }}>{concluidos.length}</div>
          <div className="text-xs mt-0.5" style={{ color: '#22C55E' }}>Concluídas</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['todos', ...freq] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: filtro === f ? (f === 'todos' ? '#13293D' : freqColor[f]) : 'white',
              color: filtro === f ? 'white' : '#374151',
              border: `1.5px solid ${filtro === f ? 'transparent' : '#E5E7EB'}`,
            }}
          >
            {f === 'todos' ? 'Todos' : freqLabel[f]}
          </button>
        ))}
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {filtrados.map(item => {
          const vencido = !item.concluido && item.proximo <= hoje
          return (
            <div
              key={item.id}
              className="rounded-xl p-5 flex items-start gap-4"
              style={{
                background: 'white',
                boxShadow: '0 1px 8px rgba(19,41,61,0.07)',
                borderLeft: `4px solid ${item.concluido ? '#22C55E' : vencido ? '#EF4444' : freqColor[item.frequencia]}`,
              }}
            >
              <button
                onClick={() => toggle(item.id)}
                className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  borderColor: item.concluido ? '#22C55E' : '#D1D5DB',
                  background: item.concluido ? '#22C55E' : 'white',
                }}
              >
                {item.concluido && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: item.concluido ? '#9CA3AF' : '#13293D', textDecoration: item.concluido ? 'line-through' : 'none' }}
                  >
                    {item.titulo}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${freqColor[item.frequencia]}15`, color: freqColor[item.frequencia] }}
                  >
                    {freqLabel[item.frequencia]}
                  </span>
                  {vencido && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                      Vencido
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{item.descricao}</p>
                <div className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                  Próximo vencimento: {new Date(item.proximo).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add button */}
      <button
        className="mt-6 w-full py-3 rounded-xl text-sm font-medium border-2 border-dashed flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
        style={{ borderColor: '#D1D5DB', color: '#6B7280' }}
      >
        <Plus size={16} />
        Adicionar Item ao Checklist
      </button>
    </div>
  )
}
