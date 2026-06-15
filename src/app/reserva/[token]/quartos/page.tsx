'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { BedDouble, UserPlus, Trash2, Check, AlertTriangle } from 'lucide-react'

type Reserva = {
  id: string; nome: string; nome_evento: string | null; tipo_evento: string
  data_inicio: string; data_fim: string; hospedes: number; status: string; token: string
}
type Quarto = { id: string; nome: string; localizacao: string; capacidade: number; climatizacao: string }
type ReservaQuarto = { id: string; quarto_id: string; hospedes: string[] }

function fmt(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') }

export default function QuartosPubicos() {
  const { token } = useParams<{ token: string }>()
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [reservaQuartos, setReservaQuartos] = useState<ReservaQuarto[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState<string | null>(null)
  const [salvo, setSalvo] = useState<string | null>(null)
  const sb = createSupabaseBrowser()

  useEffect(() => {
    async function carregar() {
      const { data: res } = await sb.from('reservas').select('id,nome,nome_evento,tipo_evento,data_inicio,data_fim,hospedes,status,token').eq('token', token).single()
      if (!res) { setErro('Reserva não encontrada ou link inválido.'); setLoading(false); return }
      if (res.status !== 'confirmada') { setErro('Este link só está disponível para reservas confirmadas.'); setLoading(false); return }
      setReserva(res as Reserva)

      const [{ data: qts }, { data: rq }] = await Promise.all([
        sb.from('quartos').select('id,nome,localizacao,capacidade,climatizacao').eq('ativo', true).order('numero'),
        sb.from('reserva_quartos').select('id,quarto_id,hospedes').eq('reserva_id', res.id),
      ])
      setQuartos((qts ?? []) as Quarto[])
      setReservaQuartos(((rq ?? []) as { id: string; quarto_id: string; hospedes: string[] | null }[]).map(x => ({ ...x, hospedes: x.hospedes ?? [] })))
      setLoading(false)
    }
    carregar()
  }, [token])

  async function salvarQuarto(rqId: string, hospedes: string[]) {
    setSalvando(rqId)
    await sb.from('reserva_quartos').update({ hospedes }).eq('id', rqId)
    setReservaQuartos(prev => prev.map(rq => rq.id === rqId ? { ...rq, hospedes } : rq))
    setSalvando(null)
    setSalvo(rqId)
    setTimeout(() => setSalvo(null), 2000)
  }

  function updateNome(rqId: string, i: number, valor: string) {
    setReservaQuartos(prev => prev.map(rq => {
      if (rq.id !== rqId) return rq
      const h = [...rq.hospedes]; h[i] = valor
      return { ...rq, hospedes: h }
    }))
  }

  function addHospede(rqId: string) {
    setReservaQuartos(prev => prev.map(rq => rq.id === rqId ? { ...rq, hospedes: [...rq.hospedes, ''] } : rq))
  }

  function removeHospede(rqId: string, i: number) {
    setReservaQuartos(prev => prev.map(rq => rq.id === rqId ? { ...rq, hospedes: rq.hospedes.filter((_, j) => j !== i) } : rq))
  }

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

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F5F7FA' }}>
      {/* Header */}
      <div className="py-8 px-4" style={{ background: '#13293D' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#006494' }}>
              <BedDouble size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: '#A8DADC' }}>CATRE — ARS</div>
              <h1 className="text-lg font-bold text-white">{reserva!.nome_evento || reserva!.tipo_evento}</h1>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-sm" style={{ color: '#A8DADC' }}>
            <span>📅 {fmt(reserva!.data_inicio)} → {fmt(reserva!.data_fim)}</span>
            <span>👥 {reserva!.hospedes} hóspedes</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
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
              <Check size={16} /> Todos os hóspedes foram cadastrados!
            </div>
          )}
        </div>

        <p className="text-sm px-1" style={{ color: '#6B7280' }}>
          Preencha os nomes dos hóspedes nos quartos abaixo. As alterações são salvas automaticamente ao clicar em <strong>Salvar</strong>.
        </p>

        {reservaQuartos.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
            <BedDouble size={40} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Os quartos desta reserva ainda não foram definidos pelo CATRE.</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Aguarde o gestor selecionar os quartos para você preencher.</p>
          </div>
        ) : (
          reservaQuartos.map(rq => {
            const q = quartos.find(x => x.id === rq.quarto_id)
            if (!q) return null
            return (
              <div key={rq.id} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-sm" style={{ color: '#13293D' }}>{q.nome}</h2>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                      {q.localizacao} · {q.climatizacao === 'ar_condicionado' ? '❄️ A/C' : '🌀 Ventilador'} · {q.capacidade} leitos
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ background: rq.hospedes.filter(n => n.trim()).length >= q.capacidade ? '#ECFDF5' : '#EFF6FF', color: rq.hospedes.filter(n => n.trim()).length >= q.capacidade ? '#059669' : '#006494' }}>
                    {rq.hospedes.filter(n => n.trim()).length}/{q.capacidade}
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
                  <button onClick={() => salvarQuarto(rq.id, rq.hospedes)}
                    disabled={salvando === rq.id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: salvo === rq.id ? '#059669' : '#006494' }}>
                    {salvando === rq.id
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : salvo === rq.id ? <><Check size={15} /> Salvo!</> : 'Salvar'}
                  </button>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>{rq.hospedes.filter(n => n.trim()).length} nomes preenchidos</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
