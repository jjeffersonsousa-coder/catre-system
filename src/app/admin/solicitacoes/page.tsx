'use client'
import { useEffect, useState } from 'react'
import { Search, Eye, Check, X, Clock } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Reserva = {
  id: string; created_at: string; nome: string; email: string; telefone: string
  igreja: string; tipo_evento: string; data_inicio: string; data_fim: string
  hospedes: number; refeicoes: boolean; mensagem: string | null
  status: string; observacao_interna: string | null
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pendente: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB' },
  confirmada: { label: 'Confirmada', color: '#059669', bg: '#ECFDF5' },
  cancelada: { label: 'Cancelada', color: '#DC2626', bg: '#FEF2F2' },
  concluida: { label: 'Concluída', color: '#6B7280', bg: '#F9FAFB' },
}

function fmt(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }
function noites(a: string, b: string) { return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000) }

export default function SolicitacoesPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('pendente')
  const [busca, setBusca] = useState('')
  const [selecionada, setSelecionada] = useState<Reserva | null>(null)
  const [obs, setObs] = useState('')
  const [salvando, setSalvando] = useState(false)
  const sb = createSupabaseBrowser()

  async function carregar() {
    setLoading(true)
    const { data } = await sb.from('reservas').select('*').order('created_at', { ascending: false })
    setReservas((data ?? []) as Reserva[])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function atualizar(id: string, status: string) {
    setSalvando(true)
    await sb.from('reservas').update({ status, observacao_interna: obs || null }).eq('id', id)
    setSalvando(false)
    setSelecionada(null)
    carregar()
  }

  const filtradas = reservas.filter(r => {
    if (filtro !== 'todos' && r.status !== filtro) return false
    if (busca) {
      const q = busca.toLowerCase()
      return r.nome.toLowerCase().includes(q) || r.igreja.toLowerCase().includes(q)
    }
    return true
  })

  const cont = {
    todos: reservas.length,
    pendente: reservas.filter(r => r.status === 'pendente').length,
    confirmada: reservas.filter(r => r.status === 'confirmada').length,
    cancelada: reservas.filter(r => r.status === 'cancelada').length,
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Solicitações de Reserva</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Solicitações recebidas pelo site público</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {[['pendente', 'Pendentes'], ['confirmada', 'Confirmadas'], ['cancelada', 'Canceladas'], ['todos', 'Todas']].map(([k, label]) => (
          <button key={k} onClick={() => setFiltro(k)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: filtro === k ? '#006494' : 'white', color: filtro === k ? 'white' : '#374151', border: filtro === k ? 'none' : '1px solid #E5E7EB' }}>
            {label}
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: filtro === k ? 'rgba(255,255,255,0.25)' : '#F3F4F6' }}>
              {cont[k as keyof typeof cont] ?? reservas.length}
            </span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-white border rounded-xl px-3 py-2" style={{ borderColor: '#E5E7EB' }}>
          <Search size={15} style={{ color: '#9CA3AF' }} />
          <input type="text" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)}
            className="text-sm outline-none w-40" style={{ color: '#374151' }} />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#9CA3AF' }}>Carregando...</div>
        ) : filtradas.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: '#9CA3AF' }}>Nenhuma solicitação encontrada.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                {['Solicitante', 'Evento', 'Período', 'Hóspedes', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-bold uppercase tracking-wider px-5 py-3.5" style={{ color: '#9CA3AF' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(r => {
                const sc = statusConfig[r.status] ?? statusConfig.pendente
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #F9FAFB' }}>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm" style={{ color: '#13293D' }}>{r.nome}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{r.igreja}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm" style={{ color: '#374151' }}>{r.tipo_evento}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{r.refeicoes ? 'Com alimentação' : 'Sem alimentação'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm" style={{ color: '#374151' }}>{fmt(r.data_inicio)} → {fmt(r.data_fim)}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{noites(r.data_inicio, r.data_fim)} noites</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#374151' }}>{r.hospedes}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setSelecionada(r); setObs(r.observacao_interna ?? '') }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80"
                        style={{ background: '#EFF6FF', color: '#006494' }}>
                        <Eye size={13} /> Ver
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelecionada(null) }}>
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
              <h2 className="font-bold text-lg" style={{ color: '#13293D' }}>Detalhes da Solicitação</h2>
              <button onClick={() => setSelecionada(null)} style={{ color: '#9CA3AF' }}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-sm px-3 py-1 rounded-full font-bold" style={{ background: statusConfig[selecionada.status]?.bg, color: statusConfig[selecionada.status]?.color }}>
                  {statusConfig[selecionada.status]?.label}
                </span>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Recebido em {new Date(selecionada.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: 'Nome', v: selecionada.nome }, { l: 'Igreja / Org.', v: selecionada.igreja },
                  { l: 'E-mail', v: selecionada.email }, { l: 'Telefone', v: selecionada.telefone },
                  { l: 'Tipo de Evento', v: selecionada.tipo_evento }, { l: 'Hóspedes', v: String(selecionada.hospedes) },
                  { l: 'Chegada', v: fmt(selecionada.data_inicio) }, { l: 'Saída', v: fmt(selecionada.data_fim) },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: '#9CA3AF' }}>{l}</div>
                    <div className="text-sm font-medium" style={{ color: '#13293D' }}>{v}</div>
                  </div>
                ))}
              </div>
              {selecionada.refeicoes && <div className="text-sm px-3 py-2 rounded-lg" style={{ background: '#F0FDF4', color: '#059669' }}>✓ Inclui serviço de alimentação</div>}
              {selecionada.mensagem && (
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#9CA3AF' }}>Mensagem</div>
                  <p className="text-sm p-3 rounded-lg" style={{ background: '#F9FAFB', color: '#374151' }}>{selecionada.mensagem}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Observação Interna</label>
                <textarea rows={2} value={obs} onChange={e => setObs(e.target.value)}
                  placeholder="Anotação interna..." className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>
              {selecionada.status === 'pendente' && (
                <div className="flex gap-3">
                  <button onClick={() => atualizar(selecionada.id, 'confirmada')} disabled={salvando}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60"
                    style={{ background: '#059669' }}>
                    <Check size={16} /> Confirmar
                  </button>
                  <button onClick={() => atualizar(selecionada.id, 'cancelada')} disabled={salvando}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm hover:opacity-90 border-2"
                    style={{ borderColor: '#DC2626', color: '#DC2626' }}>
                    <X size={16} /> Cancelar
                  </button>
                </div>
              )}
              {selecionada.status === 'confirmada' && (
                <div className="flex gap-3">
                  <button onClick={() => atualizar(selecionada.id, 'concluida')} disabled={salvando}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90"
                    style={{ background: '#6B7280' }}>
                    <Clock size={16} /> Marcar Concluída
                  </button>
                  <button onClick={() => atualizar(selecionada.id, 'cancelada')} disabled={salvando}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2"
                    style={{ borderColor: '#DC2626', color: '#DC2626' }}>
                    <X size={16} /> Cancelar
                  </button>
                </div>
              )}
              {(selecionada.status === 'cancelada' || selecionada.status === 'concluida') && (
                <button onClick={() => atualizar(selecionada.id, 'pendente')} disabled={salvando}
                  className="w-full py-3 rounded-xl font-semibold text-sm border-2 hover:bg-gray-50"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                  Reabrir como Pendente
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
