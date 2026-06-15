'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, BanIcon, CalendarX } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Bloqueio = {
  id: string
  area: string
  data_inicio: string
  data_fim: string
  motivo: string
  tipo: string
  ativo: boolean
  created_at: string
}

const tiposConfig: Record<string, { label: string; color: string; bg: string }> = {
  manutencao: { label: 'Manutenção', color: '#D97706', bg: '#FFFBEB' },
  reserva_especial: { label: 'Reserva Especial', color: '#7C3AED', bg: '#F5F3FF' },
  evento_interno: { label: 'Evento Interno', color: '#059669', bg: '#ECFDF5' },
  outro: { label: 'Outro', color: '#6B7280', bg: '#F9FAFB' },
}

const areas = [
  'Quarto 01', 'Quarto 02', 'Quarto 03', 'Quarto 04', 'Quarto 05',
  'Quarto 06', 'Quarto 07', 'Quarto 08', 'Quarto 09', 'Quarto 10',
  'Chalé 01', 'Chalé 02', 'Chalé 03', 'Chalé 04',
  'Auditório Principal', 'Sala de Reunião A', 'Sala de Reunião B',
  'Refeitório', 'Piscina', 'Quadra Esportiva', 'Area Geral',
]

type NovoBloqueio = { area: string; data_inicio: string; data_fim: string; motivo: string; tipo: string }
const bloqueioInicial: NovoBloqueio = { area: '', data_inicio: '', data_fim: '', motivo: '', tipo: 'manutencao' }

function fmt(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

function isAtivo(b: Bloqueio) {
  const hoje = new Date().toISOString().split('T')[0]
  return b.ativo && b.data_fim >= hoje
}

export default function BloqueiosPage() {
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([])
  const [loading, setLoading] = useState(true)
  const [adicionando, setAdicionando] = useState(false)
  const [novo, setNovo] = useState<NovoBloqueio>(bloqueioInicial)
  const [salvando, setSalvando] = useState(false)
  const [filtro, setFiltro] = useState<'ativos' | 'todos'>('ativos')

  const sb = createSupabaseBrowser()

  async function carregar() {
    setLoading(true)
    const { data } = await sb
      .from('bloqueios')
      .select('*')
      .order('data_inicio', { ascending: true })
    setBloqueios((data ?? []) as Bloqueio[])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function salvar() {
    if (!novo.area || !novo.data_inicio || !novo.data_fim || !novo.motivo) return
    setSalvando(true)
    await sb.from('bloqueios').insert({ ...novo, ativo: true })
    setNovo(bloqueioInicial)
    setAdicionando(false)
    setSalvando(false)
    carregar()
  }

  async function remover(id: string) {
    if (!confirm('Remover este bloqueio?')) return
    await sb.from('bloqueios').delete().eq('id', id)
    setBloqueios(prev => prev.filter(b => b.id !== id))
  }

  async function toggleAtivo(b: Bloqueio) {
    await sb.from('bloqueios').update({ ativo: !b.ativo }).eq('id', b.id)
    setBloqueios(prev => prev.map(x => x.id === b.id ? { ...x, ativo: !x.ativo } : x))
  }

  const exibidos = filtro === 'ativos'
    ? bloqueios.filter(isAtivo)
    : bloqueios

  const hoje = new Date().toISOString().split('T')[0]

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Bloqueios de Quartos e Datas</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Bloqueie áreas para manutenção, eventos internos ou reservas especiais</p>
        </div>
        <button
          onClick={() => setAdicionando(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
          style={{ background: '#006494' }}
        >
          <Plus size={18} /> Novo Bloqueio
        </button>
      </div>

      {/* Filtro */}
      <div className="flex gap-2 mb-5">
        {[{ key: 'ativos', label: 'Bloqueios Ativos' }, { key: 'todos', label: 'Todos' }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key as typeof filtro)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: filtro === key ? '#006494' : 'white',
              color: filtro === key ? 'white' : '#374151',
              border: filtro === key ? 'none' : '1px solid #E5E7EB',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards de bloqueios */}
      {loading ? (
        <div className="p-12 text-center text-sm" style={{ color: '#9CA3AF' }}>Carregando...</div>
      ) : exibidos.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
        >
          <CalendarX size={48} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-sm font-semibold mb-1" style={{ color: '#374151' }}>Nenhum bloqueio ativo</p>
          <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>Crie um bloqueio para reservar um espaço</p>
          <button
            onClick={() => setAdicionando(true)}
            className="text-sm font-semibold"
            style={{ color: '#006494' }}
          >
            + Criar primeiro bloqueio
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {exibidos.map(b => {
            const tc = tiposConfig[b.tipo] ?? tiposConfig.outro
            const passado = b.data_fim < hoje
            return (
              <div
                key={b.id}
                className="rounded-2xl p-5 border flex flex-col gap-4 transition-all"
                style={{
                  background: 'white',
                  borderColor: passado ? '#F3F4F6' : '#E5E7EB',
                  opacity: passado ? 0.6 : 1,
                  boxShadow: '0 1px 8px rgba(19,41,61,0.06)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-base" style={{ color: '#13293D' }}>{b.area}</div>
                    <span
                      className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ background: tc.bg, color: tc.color }}
                    >
                      {tc.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleAtivo(b)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                      title={b.ativo ? 'Desativar' : 'Ativar'}
                    >
                      <BanIcon size={15} style={{ color: b.ativo ? '#EF4444' : '#D1D5DB' }} />
                    </button>
                    <button
                      onClick={() => remover(b.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={15} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                  style={{ background: '#F8FAFC', color: '#374151' }}
                >
                  <CalendarX size={15} style={{ color: '#006494' }} />
                  {fmt(b.data_inicio)} → {fmt(b.data_fim)}
                  {passado && <span className="ml-auto text-xs" style={{ color: '#9CA3AF' }}>Expirado</span>}
                </div>

                <p className="text-sm" style={{ color: '#6B7280' }}>{b.motivo}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal novo bloqueio */}
      {adicionando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setAdicionando(false) }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 className="font-bold text-lg mb-5" style={{ color: '#13293D' }}>Novo Bloqueio</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Área / Quarto *</label>
                <select
                  value={novo.area}
                  onChange={e => setNovo(p => ({ ...p, area: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}
                >
                  <option value="">Selecione a área...</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Tipo de Bloqueio</label>
                <select
                  value={novo.tipo}
                  onChange={e => setNovo(p => ({ ...p, tipo: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}
                >
                  {Object.entries(tiposConfig).map(([k, { label }]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Data Início *</label>
                  <input
                    type="date"
                    value={novo.data_inicio}
                    min={hoje}
                    onChange={e => setNovo(p => ({ ...p, data_inicio: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E5E7EB', color: '#374151' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Data Fim *</label>
                  <input
                    type="date"
                    value={novo.data_fim}
                    min={novo.data_inicio || hoje}
                    onChange={e => setNovo(p => ({ ...p, data_fim: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E5E7EB', color: '#374151' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Motivo *</label>
                <input
                  type="text"
                  value={novo.motivo}
                  onChange={e => setNovo(p => ({ ...p, motivo: e.target.value }))}
                  placeholder="Ex: Reforma do banheiro, evento da diretoria..."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAdicionando(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#374151' }}
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={!novo.area || !novo.data_inicio || !novo.data_fim || !novo.motivo || salvando}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                style={{ background: '#006494' }}
              >
                {salvando ? 'Salvando...' : 'Criar Bloqueio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
