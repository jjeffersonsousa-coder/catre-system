'use client'
import { useEffect, useState } from 'react'
import { Plus, List, Calendar, X, Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Reserva = {
  id: string; created_at: string; nome: string; email: string; telefone: string
  igreja: string; nome_evento: string | null; tipo_evento: string; data_inicio: string; data_fim: string
  hospedes: number; refeicoes: boolean; mensagem: string | null
  status: string; observacao_interna: string | null; valor_total: number | null
}

const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
  pendente: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB' },
  confirmada: { label: 'Confirmada', color: '#059669', bg: '#ECFDF5' },
  cancelada: { label: 'Cancelada', color: '#DC2626', bg: '#FEF2F2' },
  concluida: { label: 'Concluída', color: '#6B7280', bg: '#F9FAFB' },
}

const tiposEvento = ['Retiro Espiritual', 'Treinamento / Capacitação', 'Convenção', 'Acampamento de Jovens', 'Evento Familiar', 'Casamento', 'Outro']

const tiposDiaria = [
  { key: 'sem_roupa', label: 'Diária Eventos — Sem Roupa de Cama', valor: 220, porPessoa: true },
  { key: 'com_roupa', label: 'Diária Eventos — Com Roupa de Cama', valor: 260, porPessoa: true },
  { key: 'departamentos', label: 'Diária Eventos Departamentos', valor: 120, porPessoa: true },
  { key: 'pastoral', label: 'Diária Família Pastoral e Funcionários', valor: 150, porPessoa: true },
  { key: 'casamento', label: 'Diária Casamento (pacote fixo)', valor: 10000, porPessoa: false },
]
const PRECO_REFEICAO = 40 // por pessoa por refeição

type NovaReserva = {
  nome: string; email: string; telefone: string; igreja: string; nome_evento: string; tipo_evento: string
  data_inicio: string; data_fim: string; hospedes: string; tipo_diaria: string
  refeicoes: boolean; desjejum: boolean; almoco: boolean; jantar: boolean
  roupa_cama: boolean; criancas_isentas: string
  mensagem: string; status: string; valor_total: string; observacao_interna: string
}
const novaReservaInicial: NovaReserva = {
  nome: '', email: '', telefone: '', igreja: '', nome_evento: '', tipo_evento: '', data_inicio: '', data_fim: '',
  hospedes: '', tipo_diaria: 'sem_roupa', refeicoes: false,
  desjejum: true, almoco: true, jantar: true, roupa_cama: false, criancas_isentas: '0',
  mensagem: '', status: 'confirmada', valor_total: '', observacao_interna: '',
}
type CardapioSelecao = Record<string, { desjejum: number; almoco: number; jantar: number }>
const planosOpts = [1, 2, 3, 4]

function calcularValor(nova: NovaReserva): number {
  const td = tiposDiaria.find(t => t.key === nova.tipo_diaria)
  if (!td) return 0
  const nts = noites(nova.data_inicio, nova.data_fim)
  const hospedes = parseInt(nova.hospedes) || 0
  const criancas = parseInt(nova.criancas_isentas) || 0
  const pagantes = Math.max(0, hospedes - criancas)
  if (nts <= 0 || hospedes <= 0) return 0

  let total = td.porPessoa ? td.valor * pagantes * nts : td.valor

  if (nova.refeicoes) {
    const dias = diasEntre(nova.data_inicio, nova.data_fim).length
    const refeicoesPorDia = (nova.desjejum ? 1 : 0) + (nova.almoco ? 1 : 0) + (nova.jantar ? 1 : 0)
    total += PRECO_REFEICAO * pagantes * refeicoesPorDia * dias
  }
  return total
}

function fmt(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }
function noites(a: string, b: string) { return Math.max(0, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000)) }

// Gera todos os dias entre duas datas
function diasEntre(inicio: string, fim: string): string[] {
  const dias: string[] = []
  const d = new Date(inicio + 'T00:00:00')
  const f = new Date(fim + 'T00:00:00')
  while (d <= f) {
    dias.push(d.toISOString().split('T')[0])
    d.setDate(d.getDate() + 1)
  }
  return dias
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'lista' | 'calendario'>('lista')
  const [filtro, setFiltro] = useState('todos')
  const [selecionada, setSelecionada] = useState<Reserva | null>(null)
  const [novaModal, setNovaModal] = useState(false)
  const [nova, setNova] = useState<NovaReserva>(novaReservaInicial)
  const [salvando, setSalvando] = useState(false)
  const [cardapioSel, setCardapioSel] = useState<CardapioSelecao>({})
  // Calendário
  const hoje = new Date()
  const [calMes, setCalMes] = useState(hoje.getMonth())
  const [calAno, setCalAno] = useState(hoje.getFullYear())
  const sb = createSupabaseBrowser()

  async function carregar() {
    setLoading(true)
    const { data } = await sb.from('reservas').select('*').order('data_inicio', { ascending: true })
    setReservas((data ?? []) as Reserva[])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  // Recalcula valor sempre que campos relevantes mudam
  useEffect(() => {
    if (nova.data_inicio && nova.data_fim && nova.hospedes && nova.tipo_diaria) {
      const v = calcularValor(nova)
      if (v > 0) setNova(p => ({ ...p, valor_total: v.toFixed(2) }))
    }
  }, [nova.data_inicio, nova.data_fim, nova.hospedes, nova.tipo_diaria, nova.refeicoes, nova.desjejum, nova.almoco, nova.jantar, nova.criancas_isentas])

  async function salvarNova() {
    if (!nova.nome || !nova.data_inicio || !nova.data_fim || !nova.hospedes) return
    setSalvando(true)
    const { data: inserted } = await sb.from('reservas').insert({
      nome: nova.nome, email: nova.email, telefone: nova.telefone, igreja: nova.igreja,
      nome_evento: nova.nome_evento || null, tipo_evento: nova.tipo_evento, data_inicio: nova.data_inicio, data_fim: nova.data_fim,
      hospedes: parseInt(nova.hospedes), refeicoes: nova.refeicoes,
      mensagem: nova.mensagem || null, status: nova.status,
      valor_total: nova.valor_total ? parseFloat(nova.valor_total) : null,
      observacao_interna: nova.observacao_interna || null,
    }).select('id').single()
    if (inserted && nova.refeicoes && Object.keys(cardapioSel).length > 0) {
      const rows = Object.entries(cardapioSel).map(([data, sel]) => ({
        reserva_id: inserted.id, data,
        desjejum_plano: sel.desjejum, almoco_plano: sel.almoco, jantar_plano: sel.jantar,
      }))
      await sb.from('reserva_cardapio').insert(rows)
    }
    setSalvando(false)
    setNovaModal(false)
    setNova(novaReservaInicial)
    setCardapioSel({})
    carregar()
  }

  function diasEstadia(): string[] {
    if (!nova.data_inicio || !nova.data_fim) return []
    return diasEntre(nova.data_inicio, nova.data_fim)
  }

  function setCardapioDay(dia: string, campo: 'desjejum' | 'almoco' | 'jantar', plano: number) {
    setCardapioSel(prev => {
      const existing = prev[dia] ?? { desjejum: 1, almoco: 1, jantar: 1 }
      return { ...prev, [dia]: { ...existing, [campo]: plano } }
    })
  }

  const filtradas = reservas.filter(r => filtro === 'todos' || r.status === filtro)

  // Calendário: reservas do mês atual
  const primeiroDia = new Date(calAno, calMes, 1)
  const ultimoDia = new Date(calAno, calMes + 1, 0)
  const diasDoMes = Array.from({ length: ultimoDia.getDate() }, (_, i) => i + 1)
  const offsetSemana = primeiroDia.getDay()
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  function reservasDoDia(dia: number): Reserva[] {
    const d = `${calAno}-${String(calMes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    return reservas.filter(r => r.data_inicio <= d && r.data_fim >= d && r.status !== 'cancelada')
  }

  const hoje2 = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Reservas</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Agenda de reservas confirmadas e histórico</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle view */}
          <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
            <button onClick={() => setView('lista')} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all"
              style={{ background: view === 'lista' ? '#006494' : 'white', color: view === 'lista' ? 'white' : '#374151' }}>
              <List size={15} /> Lista
            </button>
            <button onClick={() => setView('calendario')} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all"
              style={{ background: view === 'calendario' ? '#006494' : 'white', color: view === 'calendario' ? 'white' : '#374151' }}>
              <Calendar size={15} /> Calendário
            </button>
          </div>
          <button onClick={() => setNovaModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
            style={{ background: '#006494' }}>
            <Plus size={18} /> Nova Reserva
          </button>
        </div>
      </div>

      {/* === LISTA === */}
      {view === 'lista' && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[['todos', 'Todas'], ['confirmada', 'Confirmadas'], ['pendente', 'Pendentes'], ['concluida', 'Concluídas'], ['cancelada', 'Canceladas']].map(([k, label]) => (
              <button key={k} onClick={() => setFiltro(k)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: filtro === k ? '#006494' : 'white', color: filtro === k ? 'white' : '#374151', border: filtro === k ? 'none' : '1px solid #E5E7EB' }}>
                {label} ({reservas.filter(r => k === 'todos' || r.status === k).length})
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
            {loading ? (
              <div className="p-12 text-center text-sm" style={{ color: '#9CA3AF' }}>Carregando...</div>
            ) : filtradas.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>Nenhuma reserva encontrada.</p>
                <button onClick={() => setNovaModal(true)} className="text-sm font-semibold" style={{ color: '#006494' }}>+ Criar nova reserva</button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    {['Hóspede / Grupo', 'Evento', 'Período', 'Pessoas', 'Valor', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-xs font-bold uppercase tracking-wider px-5 py-3.5" style={{ color: '#9CA3AF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map(r => {
                    const sc = statusCfg[r.status] ?? statusCfg.pendente
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #F9FAFB' }}>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-sm" style={{ color: '#13293D' }}>{r.nome}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{r.igreja}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium" style={{ color: '#374151' }}>{r.nome_evento || r.tipo_evento}</div>
                          {r.nome_evento && <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{r.tipo_evento}</div>}
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm" style={{ color: '#374151' }}>{fmt(r.data_inicio)} → {fmt(r.data_fim)}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{noites(r.data_inicio, r.data_fim)} noites</div>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#374151' }}>{r.hospedes}</td>
                        <td className="px-5 py-4 text-sm" style={{ color: '#374151' }}>
                          {r.valor_total ? `R$ ${Number(r.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => setSelecionada(r)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80" style={{ background: '#EFF6FF', color: '#006494' }}>
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
        </>
      )}

      {/* === CALENDÁRIO === */}
      {view === 'calendario' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
            <button onClick={() => { const d = new Date(calAno, calMes - 1, 1); setCalMes(d.getMonth()); setCalAno(d.getFullYear()) }}
              className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft size={18} /></button>
            <h2 className="font-bold text-lg" style={{ color: '#13293D' }}>{meses[calMes]} {calAno}</h2>
            <button onClick={() => { const d = new Date(calAno, calMes + 1, 1); setCalMes(d.getMonth()); setCalAno(d.getFullYear()) }}
              className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight size={18} /></button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 border-b" style={{ borderColor: '#F3F4F6' }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="py-2 text-center text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: offsetSemana }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] border-r border-b" style={{ borderColor: '#F9FAFB' }} />
            ))}
            {diasDoMes.map(dia => {
              const dataStr = `${calAno}-${String(calMes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
              const res = reservasDoDia(dia)
              const isHoje = dataStr === hoje2
              return (
                <div key={dia} className="min-h-[90px] border-r border-b p-2 flex flex-col gap-1" style={{ borderColor: '#F9FAFB', background: isHoje ? '#F0F9FF' : 'white' }}>
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isHoje ? 'text-white' : ''}`}
                    style={{ background: isHoje ? '#006494' : 'transparent', color: isHoje ? 'white' : '#374151' }}>
                    {dia}
                  </span>
                  {res.slice(0, 2).map(r => (
                    <button key={r.id} onClick={() => setSelecionada(r)}
                      className="text-left text-xs px-1.5 py-0.5 rounded font-medium truncate w-full"
                      style={{ background: statusCfg[r.status]?.bg, color: statusCfg[r.status]?.color }}>
                      {r.nome_evento || r.nome.split(' ')[0]}
                    </button>
                  ))}
                  {res.length > 2 && (
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>+{res.length - 2}</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="px-6 py-3 border-t flex gap-4 flex-wrap" style={{ borderColor: '#F3F4F6' }}>
            {Object.entries(statusCfg).map(([k, { label, color, bg }]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: bg, border: `1px solid ${color}` }} />
                <span className="text-xs" style={{ color: '#6B7280' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal detalhes */}
      {selecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelecionada(null) }}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
              <h2 className="font-bold text-lg" style={{ color: '#13293D' }}>Detalhes da Reserva</h2>
              <button onClick={() => setSelecionada(null)} style={{ color: '#9CA3AF' }}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <span className="text-sm px-3 py-1 rounded-full font-bold" style={{ background: statusCfg[selecionada.status]?.bg, color: statusCfg[selecionada.status]?.color }}>
                {statusCfg[selecionada.status]?.label}
              </span>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {[
                  { l: 'Nome', v: selecionada.nome }, { l: 'Igreja', v: selecionada.igreja },
                  { l: 'E-mail', v: selecionada.email }, { l: 'Telefone', v: selecionada.telefone },
                  { l: 'Evento', v: selecionada.tipo_evento }, { l: 'Hóspedes', v: String(selecionada.hospedes) },
                  { l: 'Chegada', v: fmt(selecionada.data_inicio) }, { l: 'Saída', v: fmt(selecionada.data_fim) },
                  { l: 'Noites', v: String(noites(selecionada.data_inicio, selecionada.data_fim)) },
                  { l: 'Valor Total', v: selecionada.valor_total ? `R$ ${Number(selecionada.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informado' },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: '#9CA3AF' }}>{l}</div>
                    <div className="text-sm" style={{ color: '#13293D' }}>{v}</div>
                  </div>
                ))}
              </div>
              {selecionada.observacao_interna && (
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#9CA3AF' }}>Obs. Interna</div>
                  <p className="text-sm p-3 rounded-lg" style={{ background: '#F9FAFB', color: '#374151' }}>{selecionada.observacao_interna}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal nova reserva */}
      {novaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setNovaModal(false) }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
              <h2 className="font-bold text-lg" style={{ color: '#13293D' }}>Nova Reserva Manual</h2>
              <button onClick={() => setNovaModal(false)} style={{ color: '#9CA3AF' }}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { l: 'Nome completo *', f: 'nome', t: 'text', ph: 'Nome do responsável' },
                  { l: 'Igreja / Organização *', f: 'igreja', t: 'text', ph: 'Nome da igreja' },
                  { l: 'E-mail', f: 'email', t: 'email', ph: 'email@exemplo.com' },
                  { l: 'Telefone / WhatsApp', f: 'telefone', t: 'tel', ph: '(00) 99999-9999' },
                ].map(({ l, f, t, ph }) => (
                  <div key={f}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>{l}</label>
                    <input type={t} value={nova[f as keyof NovaReserva] as string}
                      onChange={e => setNova(p => ({ ...p, [f]: e.target.value }))} placeholder={ph}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Tipo de Evento</label>
                  <select value={nova.tipo_evento} onChange={e => setNova(p => ({ ...p, tipo_evento: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                    <option value="">Selecione...</option>
                    {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Nome do Evento</label>
                  <input type="text" value={nova.nome_evento} onChange={e => setNova(p => ({ ...p, nome_evento: e.target.value }))}
                    placeholder="Ex: Retiro da Juventude 2026"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Chegada *</label>
                  <input type="date" value={nova.data_inicio} onChange={e => setNova(p => ({ ...p, data_inicio: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Saída *</label>
                  <input type="date" value={nova.data_fim} min={nova.data_inicio} onChange={e => setNova(p => ({ ...p, data_fim: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Hóspedes *</label>
                  <input type="number" min="1" value={nova.hospedes} onChange={e => setNova(p => ({ ...p, hospedes: e.target.value }))}
                    placeholder="0" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                </div>
              </div>

              {/* Tipo de diária */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Tipo de Diária (preços 2026)</label>
                <select value={nova.tipo_diaria} onChange={e => setNova(p => ({ ...p, tipo_diaria: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                  {tiposDiaria.map(t => (
                    <option key={t.key} value={t.key}>
                      {t.label} — R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{t.porPessoa ? '/pessoa/noite' : ' (fixo)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crianças isentas */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Crianças até 7 anos (isentas)</label>
                  <input type="number" min="0" value={nova.criancas_isentas} onChange={e => setNova(p => ({ ...p, criancas_isentas: e.target.value }))}
                    placeholder="0" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Status</label>
                  <select value={nova.status} onChange={e => setNova(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                    <option value="confirmada">Confirmada</option>
                    <option value="pendente">Pendente</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
              </div>

              {/* Alimentação — mínimo 50 pessoas */}
              <div>
                {parseInt(nova.hospedes) >= 50 ? (
                  <div className="flex items-center gap-3 mb-3">
                    <input type="checkbox" id="ref2" checked={nova.refeicoes} onChange={e => setNova(p => ({ ...p, refeicoes: e.target.checked }))}
                      className="w-4 h-4 rounded" style={{ accentColor: '#006494' }} />
                    <label htmlFor="ref2" className="text-sm font-semibold" style={{ color: '#374151' }}>Inclui alimentação (R$ 40,00/pessoa/refeição)</label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 rounded-xl mb-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <span className="text-sm mt-0.5">⚠️</span>
                    <p className="text-xs" style={{ color: '#92400E' }}>
                      Alimentação disponível apenas para grupos com <strong>50+ pessoas</strong>.
                      {nova.hospedes && parseInt(nova.hospedes) > 0 && parseInt(nova.hospedes) < 50
                        ? ` (${nova.hospedes} informado — faltam ${50 - parseInt(nova.hospedes)})`
                        : ''}
                    </p>
                  </div>
                )}
                {nova.refeicoes && parseInt(nova.hospedes) >= 50 && (
                  <div className="flex gap-4 ml-7">
                    {[['desjejum', '☕ Desjejum'], ['almoco', '☀️ Almoço'], ['jantar', '🌙 Jantar']].map(([f, label]) => (
                      <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={nova[f as 'desjejum' | 'almoco' | 'jantar']}
                          onChange={e => setNova(p => ({ ...p, [f]: e.target.checked }))}
                          className="w-4 h-4 rounded" style={{ accentColor: '#006494' }} />
                        <span style={{ color: '#374151' }}>{label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumo do valor */}
              {nova.data_inicio && nova.data_fim && nova.hospedes && (
                <div className="rounded-xl p-4" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold mb-0.5" style={{ color: '#0369A1' }}>Valor Total Calculado</div>
                      <div className="text-xs" style={{ color: '#6B7280' }}>
                        {noites(nova.data_inicio, nova.data_fim)} noite(s) ·{' '}
                        {parseInt(nova.hospedes) - (parseInt(nova.criancas_isentas) || 0)} pagantes
                        {nova.refeicoes ? ' · com alimentação' : ''}
                      </div>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: '#006494' }}>
                      R$ {nova.valor_total ? parseFloat(nova.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#0369A1' }}>Ajustar valor manualmente (opcional)</label>
                    <input type="number" step="0.01" value={nova.valor_total} onChange={e => setNova(p => ({ ...p, valor_total: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#BAE6FD', color: '#374151' }} />
                  </div>
                </div>
              )}

              {/* Seleção de cardápio por dia */}
              {nova.refeicoes && nova.data_inicio && nova.data_fim && (
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
                  <div className="px-4 py-3 font-semibold text-sm flex items-center gap-2" style={{ background: '#F0F9FF', color: '#006494' }}>
                    🍽️ Cardápio por dia — selecione o plano desejado
                  </div>
                  <div className="divide-y divide-gray-100">
                    {diasEstadia().map(dia => {
                      const sel = cardapioSel[dia] ?? { desjejum: 1, almoco: 1, jantar: 1 }
                      const dFmt = new Date(dia + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
                      return (
                        <div key={dia} className="px-4 py-3">
                          <div className="text-xs font-bold mb-2 capitalize" style={{ color: '#374151' }}>{dFmt}</div>
                          <div className="grid grid-cols-3 gap-2">
                            {([['desjejum', '☕ Desjejum'], ['almoco', '☀️ Almoço'], ['jantar', '🌙 Jantar']] as const).map(([campo, label]) => (
                              <div key={campo}>
                                <div className="text-xs mb-1" style={{ color: '#9CA3AF' }}>{label}</div>
                                <select value={sel[campo]}
                                  onChange={e => setCardapioDay(dia, campo, parseInt(e.target.value))}
                                  className="w-full px-2 py-1.5 rounded-lg border text-xs outline-none"
                                  style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                                  {planosOpts.map(p => <option key={p} value={p}>Plano {p}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Observação Interna</label>
                <textarea rows={2} value={nova.observacao_interna} onChange={e => setNova(p => ({ ...p, observacao_interna: e.target.value }))}
                  placeholder="Notas internas..." className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setNovaModal(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}>Cancelar</button>
                <button onClick={salvarNova} disabled={!nova.nome || !nova.data_inicio || !nova.data_fim || !nova.hospedes || salvando}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: '#006494' }}>
                  {salvando ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={16} /> Salvar Reserva</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
