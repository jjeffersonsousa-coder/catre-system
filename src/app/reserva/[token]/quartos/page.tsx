'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { BedDouble, UserPlus, Trash2, Check, AlertTriangle, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react'

type Reserva = {
  id: string; nome: string; nome_evento: string | null; tipo_evento: string
  data_inicio: string; data_fim: string; hospedes: number; status: string; token: string
  refeicoes: boolean
}
type Quarto = { id: string; nome: string; localizacao: string; capacidade: number; climatizacao: string }
type ReservaQuarto = { id: string; quarto_id: string; hospedes: string[] }
type CardapioItem = { tipo_refeicao: string; plano: number; nome: string; descricao: string | null }
type DiaCardapio = { desjejum: number; almoco: number; jantar: number }

function fmt(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }
function fmtDia(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) }

function diasEntre(inicio: string, fim: string): string[] {
  const dias: string[] = []
  const d = new Date(inicio + 'T00:00:00')
  const f = new Date(fim + 'T00:00:00')
  while (d <= f) { dias.push(d.toISOString().split('T')[0]); d.setDate(d.getDate() + 1) }
  return dias
}

const refeicaoLabel: Record<string, string> = { cafe: '☕ Desjejum', almoco: '☀️ Almoço', jantar: '🌙 Jantar' }
const refeicaoKey: Array<{ campo: 'desjejum' | 'almoco' | 'jantar'; tipo: string; label: string }> = [
  { campo: 'desjejum', tipo: 'cafe', label: '☕ Desjejum' },
  { campo: 'almoco', tipo: 'almoco', label: '☀️ Almoço' },
  { campo: 'jantar', tipo: 'jantar', label: '🌙 Jantar' },
]

export default function QuartosPublicos() {
  const { token } = useParams<{ token: string }>()
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [reservaQuartos, setReservaQuartos] = useState<ReservaQuarto[]>([])
  const [cardapioItems, setCardapioItems] = useState<CardapioItem[]>([])
  const [cardapioSel, setCardapioSel] = useState<Record<string, DiaCardapio>>({})
  const [cardapioSalvo, setCardapioSalvo] = useState(false)
  const [salvandoCardapio, setSalvandoCardapio] = useState(false)
  const [diaAberto, setDiaAberto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState<string | null>(null)
  const [salvo, setSalvo] = useState<string | null>(null)
  const [aba, setAba] = useState<'quartos' | 'cardapio'>('quartos')
  const sb = createSupabaseBrowser()

  useEffect(() => {
    async function carregar() {
      const { data: res } = await sb.from('reservas')
        .select('id,nome,nome_evento,tipo_evento,data_inicio,data_fim,hospedes,status,token,refeicoes')
        .eq('token', token).single()
      if (!res) { setErro('Reserva não encontrada ou link inválido.'); setLoading(false); return }
      if (res.status !== 'confirmada') { setErro('Este link só está disponível para reservas confirmadas.'); setLoading(false); return }
      setReserva(res as Reserva)

      const [{ data: qts }, { data: rq }, { data: ci }, { data: rc }] = await Promise.all([
        sb.from('quartos').select('id,nome,localizacao,capacidade,climatizacao').eq('ativo', true).order('numero'),
        sb.from('reserva_quartos').select('id,quarto_id,hospedes').eq('reserva_id', res.id),
        sb.from('cardapio').select('tipo_refeicao,plano,nome,descricao').eq('ativo', true).order('plano'),
        sb.from('reserva_cardapio').select('data,desjejum_plano,almoco_plano,jantar_plano').eq('reserva_id', res.id),
      ])

      setQuartos((qts ?? []) as Quarto[])
      setReservaQuartos(((rq ?? []) as { id: string; quarto_id: string; hospedes: string[] | null }[])
        .map(x => ({ ...x, hospedes: x.hospedes ?? [] })))
      setCardapioItems((ci ?? []) as CardapioItem[])

      // Inicializa seleções de cardápio com dados existentes ou padrão plano 1
      const dias = diasEntre(res.data_inicio, res.data_fim)
      const sel: Record<string, DiaCardapio> = {}
      for (const dia of dias) {
        const existente = (rc ?? []).find((r: { data: string }) => r.data === dia)
        sel[dia] = existente
          ? { desjejum: (existente as { desjejum_plano: number }).desjejum_plano, almoco: (existente as { almoco_plano: number }).almoco_plano, jantar: (existente as { jantar_plano: number }).jantar_plano }
          : { desjejum: 1, almoco: 1, jantar: 1 }
      }
      setCardapioSel(sel)
      setDiaAberto(dias[0] ?? null)
      setLoading(false)
    }
    carregar()
  }, [token])

  async function salvarQuarto(rqId: string, hospedes: string[]) {
    setSalvando(rqId)
    await sb.from('reserva_quartos').update({ hospedes }).eq('id', rqId)
    setReservaQuartos(prev => prev.map(rq => rq.id === rqId ? { ...rq, hospedes } : rq))
    setSalvando(null); setSalvo(rqId)
    setTimeout(() => setSalvo(null), 2000)
  }

  async function salvarCardapio() {
    if (!reserva) return
    setSalvandoCardapio(true)
    const rows = Object.entries(cardapioSel).map(([data, sel]) => ({
      reserva_id: reserva.id, data,
      desjejum_plano: sel.desjejum, almoco_plano: sel.almoco, jantar_plano: sel.jantar,
    }))
    // Upsert: deleta e reinsere
    await sb.from('reserva_cardapio').delete().eq('reserva_id', reserva.id)
    await sb.from('reserva_cardapio').insert(rows)
    setSalvandoCardapio(false)
    setCardapioSalvo(true)
    setTimeout(() => setCardapioSalvo(false), 3000)
  }

  function setPlano(dia: string, campo: 'desjejum' | 'almoco' | 'jantar', plano: number) {
    setCardapioSel(prev => ({ ...prev, [dia]: { ...prev[dia], [campo]: plano } }))
  }

  function getItem(tipo: string, plano: number) {
    return cardapioItems.find(c => c.tipo_refeicao === tipo && c.plano === plano)
  }

  function updateNome(rqId: string, i: number, valor: string) {
    setReservaQuartos(prev => prev.map(rq => {
      if (rq.id !== rqId) return rq
      const h = [...rq.hospedes]; h[i] = valor; return { ...rq, hospedes: h }
    }))
  }
  function addHospede(rqId: string) { setReservaQuartos(prev => prev.map(rq => rq.id === rqId ? { ...rq, hospedes: [...rq.hospedes, ''] } : rq)) }
  function removeHospede(rqId: string, i: number) { setReservaQuartos(prev => prev.map(rq => rq.id === rqId ? { ...rq, hospedes: rq.hospedes.filter((_, j) => j !== i) } : rq)) }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F7FA' }}>
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )

  if (erro) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F5F7FA' }}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <AlertTriangle size={48} className="mx-auto mb-4" style={{ color: '#F59E0B' }} />
        <h1 className="font-bold text-lg mb-2" style={{ color: '#13293D' }}>Link inválido</h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>{erro}</p>
      </div>
    </div>
  )

  const totalCadastrados = reservaQuartos.reduce((acc, rq) => acc + rq.hospedes.filter(n => n.trim()).length, 0)
  const dias = diasEntre(reserva!.data_inicio, reserva!.data_fim)
  const temCardapio = reserva!.refeicoes

  return (
    <div className="min-h-screen pb-16" style={{ background: '#F5F7FA' }}>
      {/* Header */}
      <div className="py-8 px-4" style={{ background: 'linear-gradient(135deg, #13293D 0%, #006494 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <BedDouble size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(168,218,220,0.8)' }}>CATRE — ARS</div>
              <h1 className="text-lg font-bold text-white">{reserva!.nome_evento || reserva!.tipo_evento}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: 'rgba(168,218,220,0.9)' }}>
            <span>📅 {fmt(reserva!.data_inicio)} → {fmt(reserva!.data_fim)}</span>
            <span>👥 {reserva!.hospedes} hóspedes</span>
            {temCardapio && <span>🍽️ Com alimentação</span>}
          </div>
        </div>
      </div>

      {/* Abas — só mostra se tiver cardápio */}
      {temCardapio && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="flex rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
            <button onClick={() => setAba('quartos')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all"
              style={{ background: aba === 'quartos' ? '#13293D' : 'white', color: aba === 'quartos' ? 'white' : '#9CA3AF' }}>
              <BedDouble size={16} /> Quartos
            </button>
            <button onClick={() => setAba('cardapio')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all"
              style={{ background: aba === 'cardapio' ? '#006494' : 'white', color: aba === 'cardapio' ? 'white' : '#9CA3AF' }}>
              <UtensilsCrossed size={16} /> Cardápio
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-4">

        {/* ===== ABA QUARTOS ===== */}
        {aba === 'quartos' && (
          <>
            {/* Progresso */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: '#374151' }}>Hóspedes cadastrados</span>
                <span className="text-sm font-bold" style={{ color: '#006494' }}>{totalCadastrados} / {reserva!.hospedes}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (totalCadastrados / reserva!.hospedes) * 100)}%`, background: '#006494' }} />
              </div>
              {totalCadastrados === reserva!.hospedes && (
                <div className="flex items-center gap-2 mt-3 text-sm font-semibold" style={{ color: '#059669' }}>
                  <Check size={16} /> Todos os hóspedes cadastrados!
                </div>
              )}
            </div>

            <p className="text-sm px-1" style={{ color: '#6B7280' }}>
              Preencha os nomes dos hóspedes nos quartos abaixo e clique em <strong>Salvar</strong> em cada quarto.
            </p>

            {reservaQuartos.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                <BedDouble size={40} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Os quartos desta reserva ainda não foram definidos pelo CATRE.</p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Aguarde o gestor selecionar os quartos.</p>
              </div>
            ) : (
              reservaQuartos.map(rq => {
                const q = quartos.find(x => x.id === rq.quarto_id)
                if (!q) return null
                const preenchidos = rq.hospedes.filter(n => n.trim()).length
                return (
                  <div key={rq.id} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-bold text-sm" style={{ color: '#13293D' }}>{q.nome}</h2>
                        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                          {q.localizacao} · {q.climatizacao === 'ar_condicionado' ? '❄️ A/C' : '🌀 Ventilador'} · {q.capacidade} leitos
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: preenchidos >= q.capacidade ? '#ECFDF5' : '#EFF6FF', color: preenchidos >= q.capacidade ? '#059669' : '#006494' }}>
                        {preenchidos}/{q.capacidade}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {rq.hospedes.map((nome, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs w-5 text-right flex-shrink-0" style={{ color: '#9CA3AF' }}>{i + 1}.</span>
                          <input type="text" value={nome} onChange={e => updateNome(rq.id, i, e.target.value)}
                            placeholder={`Nome do hóspede ${i + 1}`}
                            className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                            style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                          <button onClick={() => removeHospede(rq.id, i)} className="p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0">
                            <Trash2 size={14} style={{ color: '#EF4444' }} />
                          </button>
                        </div>
                      ))}
                      {rq.hospedes.length < q.capacidade && (
                        <button onClick={() => addHospede(rq.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl w-full transition-all hover:opacity-80"
                          style={{ background: '#EFF6FF', color: '#006494' }}>
                          <UserPlus size={13} /> Adicionar hóspede
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => salvarQuarto(rq.id, rq.hospedes)} disabled={salvando === rq.id}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                        style={{ background: salvo === rq.id ? '#059669' : '#006494' }}>
                        {salvando === rq.id
                          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : salvo === rq.id ? <><Check size={15} /> Salvo!</> : 'Salvar'}
                      </button>
                      <span className="text-xs" style={{ color: '#9CA3AF' }}>{preenchidos} nomes preenchidos</span>
                    </div>
                  </div>
                )
              })
            )}

            {temCardapio && (
              <button onClick={() => setAba('cardapio')}
                className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: '#006494', color: 'white' }}>
                <UtensilsCrossed size={16} /> Próximo: Selecionar Cardápio →
              </button>
            )}
          </>
        )}

        {/* ===== ABA CARDÁPIO ===== */}
        {aba === 'cardapio' && temCardapio && (
          <>
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <div className="flex items-center gap-3 mb-1">
                <UtensilsCrossed size={20} style={{ color: '#006494' }} />
                <div>
                  <h2 className="font-bold text-sm" style={{ color: '#13293D' }}>Selecione o cardápio</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Escolha o plano desejado para cada refeição de cada dia</p>
                </div>
              </div>
            </div>

            {dias.map(dia => {
              const sel = cardapioSel[dia] ?? { desjejum: 1, almoco: 1, jantar: 1 }
              const aberto = diaAberto === dia
              return (
                <div key={dia} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                  {/* Header do dia */}
                  <button onClick={() => setDiaAberto(aberto ? null : dia)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    style={{ background: aberto ? '#F0F9FF' : 'white' }}>
                    <div>
                      <div className="font-bold text-sm capitalize" style={{ color: '#13293D' }}>{fmtDia(dia)}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                        ☕ Plano {sel.desjejum} · ☀️ Plano {sel.almoco} · 🌙 Plano {sel.jantar}
                      </div>
                    </div>
                    {aberto ? <ChevronUp size={18} style={{ color: '#006494' }} /> : <ChevronDown size={18} style={{ color: '#9CA3AF' }} />}
                  </button>

                  {/* Refeições do dia */}
                  {aberto && (
                    <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: '#E8F4F8' }}>
                      {refeicaoKey.map(({ campo, tipo, label }) => {
                        const planoSel = sel[campo]
                        return (
                          <div key={campo}>
                            <div className="text-xs font-bold uppercase tracking-wider mb-2 mt-4" style={{ color: '#374151' }}>{label}</div>
                            <div className="grid grid-cols-2 gap-2">
                              {[1, 2, 3, 4].map(p => {
                                const item = getItem(tipo, p)
                                const ativo = planoSel === p
                                return (
                                  <button key={p} onClick={() => setPlano(dia, campo, p)}
                                    className="p-3 rounded-xl border-2 text-left transition-all"
                                    style={{
                                      borderColor: ativo ? '#006494' : '#E5E7EB',
                                      background: ativo ? '#EFF6FF' : 'white',
                                    }}>
                                    <div className="text-xs font-bold mb-0.5" style={{ color: ativo ? '#006494' : '#9CA3AF' }}>Plano {p}</div>
                                    {item ? (
                                      <>
                                        <div className="text-sm font-semibold leading-tight" style={{ color: ativo ? '#13293D' : '#374151' }}>{item.nome}</div>
                                        {item.descricao && <div className="text-xs mt-0.5 leading-tight" style={{ color: '#9CA3AF' }}>{item.descricao}</div>}
                                      </>
                                    ) : (
                                      <div className="text-xs" style={{ color: '#D1D5DB' }}>Sem descrição</div>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Botão salvar cardápio */}
            <button onClick={salvarCardapio} disabled={salvandoCardapio}
              className="w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: cardapioSalvo ? '#059669' : 'linear-gradient(135deg, #13293D 0%, #006494 100%)', color: 'white' }}>
              {salvandoCardapio
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : cardapioSalvo
                  ? <><Check size={18} /> Cardápio salvo com sucesso!</>
                  : <><UtensilsCrossed size={18} /> Salvar Cardápio</>}
            </button>
            <p className="text-center text-xs" style={{ color: '#9CA3AF' }}>
              Você pode alterar o cardápio quantas vezes quiser antes do evento.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
