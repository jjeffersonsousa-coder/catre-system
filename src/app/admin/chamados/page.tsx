'use client'
import { useEffect, useState } from 'react'
import { Wrench, Check, Clock, AlertTriangle, X, Copy, ExternalLink } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Chamado = {
  id: string; created_at: string; nome_hospede: string; categoria: string
  descricao: string; urgencia: string; status: string; observacao: string | null
  quarto: { nome: string; localizacao: string } | null
}

const statusCfg: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  aberta: { label: 'Aberta', color: '#D97706', bg: '#FFFBEB', icon: <Clock size={13} /> },
  em_andamento: { label: 'Em Andamento', color: '#006494', bg: '#EFF6FF', icon: <Wrench size={13} /> },
  resolvida: { label: 'Resolvida', color: '#059669', bg: '#ECFDF5', icon: <Check size={13} /> },
}

export default function ChamadosPage() {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('aberta')
  const [selecionado, setSelecionado] = useState<Chamado | null>(null)
  const [obs, setObs] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const sb = createSupabaseBrowser()

  async function carregar() {
    setLoading(true)
    const { data } = await sb
      .from('solicitacoes_manutencao')
      .select('*, quarto:quartos(nome,localizacao)')
      .order('created_at', { ascending: false })
    setChamados((data ?? []) as Chamado[])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function atualizarStatus(id: string, status: string) {
    setSalvando(true)
    await sb.from('solicitacoes_manutencao').update({ status, observacao: obs || null }).eq('id', id)
    setSalvando(false)
    setSelecionado(null)
    carregar()
  }

  function copiarLink() {
    navigator.clipboard.writeText(`${window.location.origin}/manutencao/solicitar`)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  const filtrados = chamados.filter(c => filtro === 'todos' || c.status === filtro)
  const counts = { aberta: chamados.filter(c => c.status === 'aberta').length, em_andamento: chamados.filter(c => c.status === 'em_andamento').length, resolvida: chamados.filter(c => c.status === 'resolvida').length }

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Chamados de Hóspedes</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Solicitações de manutenção enviadas pelos hóspedes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={copiarLink}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: linkCopiado ? '#059669' : '#F97316', color: 'white' }}>
            <Copy size={15} /> {linkCopiado ? 'Copiado!' : 'Copiar Link Público'}
          </button>
          <a href="/manutencao/solicitar" target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80"
            style={{ background: '#EFF6FF', color: '#006494' }}>
            <ExternalLink size={15} /> Ver Formulário
          </a>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { key: 'aberta', label: 'Abertas', count: counts.aberta, color: '#D97706', bg: '#FFFBEB' },
          { key: 'em_andamento', label: 'Em Andamento', count: counts.em_andamento, color: '#006494', bg: '#EFF6FF' },
          { key: 'resolvida', label: 'Resolvidas', count: counts.resolvida, color: '#059669', bg: '#ECFDF5' },
        ].map(c => (
          <button key={c.key} onClick={() => setFiltro(c.key)}
            className="rounded-2xl p-4 text-left transition-all hover:opacity-90"
            style={{ background: filtro === c.key ? c.color : 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
            <div className="text-3xl font-black mb-1" style={{ color: filtro === c.key ? 'white' : c.color }}>{c.count}</div>
            <div className="text-sm font-semibold" style={{ color: filtro === c.key ? 'rgba(255,255,255,0.85)' : '#6B7280' }}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        {[['todos', 'Todos'], ['aberta', 'Abertos'], ['em_andamento', 'Em Andamento'], ['resolvida', 'Resolvidos']].map(([k, label]) => (
          <button key={k} onClick={() => setFiltro(k)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: filtro === k ? '#13293D' : 'white', color: filtro === k ? 'white' : '#374151', border: '1px solid #E5E7EB' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#9CA3AF' }}>Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench size={36} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Nenhum chamado encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtrados.map(c => {
              const sc = statusCfg[c.status] ?? statusCfg.aberta
              return (
                <div key={c.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm" style={{ color: '#13293D' }}>
                          {c.quarto?.nome ?? '—'}
                        </span>
                        {c.urgencia === 'urgente' && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: '#FEF2F2', color: '#DC2626' }}>
                            <AlertTriangle size={11} /> URGENTE
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <div className="text-xs mb-1 font-semibold" style={{ color: '#006494' }}>{c.categoria}</div>
                      <p className="text-sm truncate" style={{ color: '#374151' }}>{c.descricao}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: '#9CA3AF' }}>
                        <span>👤 {c.nome_hospede}</span>
                        <span>📍 {c.quarto?.localizacao ?? '—'}</span>
                        <span>🕐 {new Date(c.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <button onClick={() => { setSelecionado(c); setObs(c.observacao ?? '') }}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80"
                      style={{ background: '#EFF6FF', color: '#006494' }}>
                      Gerenciar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {selecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelecionado(null) }}>
          <div className="bg-white rounded-2xl w-full max-w-lg" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
              <h2 className="font-bold text-base" style={{ color: '#13293D' }}>Gerenciar Chamado</h2>
              <button onClick={() => setSelecionado(null)} style={{ color: '#9CA3AF' }}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl p-4" style={{ background: '#F9FAFB' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm" style={{ color: '#13293D' }}>{selecionado.quarto?.nome}</span>
                  {selecionado.urgencia === 'urgente' && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#FEF2F2', color: '#DC2626' }}>URGENTE</span>
                  )}
                </div>
                <div className="text-xs font-semibold mb-1" style={{ color: '#006494' }}>{selecionado.categoria}</div>
                <p className="text-sm" style={{ color: '#374151' }}>{selecionado.descricao}</p>
                <div className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
                  Hóspede: {selecionado.nome_hospede} · {new Date(selecionado.created_at).toLocaleString('pt-BR')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Observação / Ação tomada</label>
                <textarea rows={3} value={obs} onChange={e => setObs(e.target.value)}
                  placeholder="Descreva o que foi feito..."
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { s: 'aberta', label: 'Aberta', color: '#D97706', bg: '#FFFBEB' },
                  { s: 'em_andamento', label: 'Em Andamento', color: '#006494', bg: '#EFF6FF' },
                  { s: 'resolvida', label: 'Resolvida', color: '#059669', bg: '#ECFDF5' },
                ].map(op => (
                  <button key={op.s} onClick={() => atualizarStatus(selecionado.id, op.s)} disabled={salvando}
                    className="py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: selecionado.status === op.s ? op.color : op.bg, color: selecionado.status === op.s ? 'white' : op.color }}>
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
