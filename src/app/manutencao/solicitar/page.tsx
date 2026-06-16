'use client'
import { useEffect, useState } from 'react'
import { Wrench, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Quarto = { id: string; nome: string; localizacao: string }

const categorias = [
  'Elétrica (luz, tomada, disjuntor)',
  'Hidráulica (vazamento, torneira, vaso)',
  'Ar-condicionado / Ventilador',
  'Porta / Janela / Fechadura',
  'Cama / Colchão / Mobiliário',
  'Limpeza urgente',
  'Internet / TV',
  'Outro',
]

export default function SolicitarManutencao() {
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [form, setForm] = useState({
    quarto_id: '', nome_hospede: '', categoria: '', descricao: '', urgencia: 'normal',
  })
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')
  const sb = createSupabaseBrowser()

  useEffect(() => {
    sb.from('quartos').select('id,nome,localizacao').eq('ativo', true).order('numero')
      .then(({ data }) => setQuartos((data ?? []) as Quarto[]))
  }, [])

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.quarto_id || !form.nome_hospede || !form.descricao) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }
    setErro('')
    setLoading(true)
    const { error } = await sb.from('solicitacoes_manutencao').insert({
      quarto_id: form.quarto_id,
      nome_hospede: form.nome_hospede,
      categoria: form.categoria || 'Outro',
      descricao: form.descricao,
      urgencia: form.urgencia,
    })
    setLoading(false)
    if (error) { setErro(`Erro: ${error.message} (código: ${error.code})`); return }
    setEnviado(true)
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#F5F7FA' }}>
      {/* Header */}
      <div className="py-8 px-4" style={{ background: 'linear-gradient(135deg, #13293D 0%, #006494 100%)' }}>
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Wrench size={22} style={{ color: 'white' }} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(168,218,220,0.8)' }}>CATRE — ARS</div>
            <h1 className="text-xl font-bold text-white">Solicitar Manutenção</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Registre um problema no seu quarto</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6">
        {enviado ? (
          <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#F0FDF4' }}>
              <CheckCircle size={40} style={{ color: '#22C55E' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#13293D' }}>Solicitação Enviada!</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Nossa equipe de manutenção foi notificada e irá atender em breve.
            </p>
            <button onClick={() => { setEnviado(false); setForm({ quarto_id: '', nome_hospede: '', categoria: '', descricao: '', urgencia: 'normal' }) }}
              className="px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90"
              style={{ background: '#006494' }}>
              Nova Solicitação
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-4">
            {/* Quarto */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#006494' }}>
                1. Seu Quarto *
              </label>
              <div className="relative">
                <select required value={form.quarto_id} onChange={e => set('quarto_id', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none appearance-none"
                  style={{ borderColor: form.quarto_id ? '#006494' : '#E5E7EB', color: form.quarto_id ? '#13293D' : '#9CA3AF', background: 'white' }}>
                  <option value="">Selecione o quarto...</option>
                  {quartos.map(q => (
                    <option key={q.id} value={q.id}>{q.nome}{q.localizacao ? ` — ${q.localizacao}` : ''}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
              </div>
            </div>

            {/* Nome */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#006494' }}>
                2. Seu Nome *
              </label>
              <input required type="text" value={form.nome_hospede} onChange={e => set('nome_hospede', e.target.value)}
                placeholder="Como você se chama?"
                className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: form.nome_hospede ? '#006494' : '#E5E7EB', color: '#13293D' }} />
            </div>

            {/* Categoria */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#006494' }}>
                3. Categoria do Problema
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categorias.map(cat => (
                  <button key={cat} type="button" onClick={() => set('categoria', cat)}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all"
                    style={{
                      background: form.categoria === cat ? '#13293D' : '#F5F7FA',
                      color: form.categoria === cat ? 'white' : '#374151',
                      border: form.categoria === cat ? '2px solid #13293D' : '2px solid transparent',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#006494' }}>
                4. Descreva o Problema *
              </label>
              <textarea required rows={4} value={form.descricao} onChange={e => set('descricao', e.target.value)}
                placeholder="Descreva o que está acontecendo com o maior detalhamento possível..."
                className="w-full px-4 py-3.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: form.descricao ? '#006494' : '#E5E7EB', color: '#13293D' }} />
            </div>

            {/* Urgência */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#006494' }}>
                5. Nível de Urgência
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'normal', label: 'Normal', desc: 'Pode aguardar', color: '#006494', bg: '#EFF6FF' },
                  { v: 'urgente', label: 'Urgente', desc: 'Precisa de atenção imediata', color: '#DC2626', bg: '#FEF2F2' },
                ].map(op => (
                  <button key={op.v} type="button" onClick={() => set('urgencia', op.v)}
                    className="p-4 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor: form.urgencia === op.v ? op.color : '#E5E7EB',
                      background: form.urgencia === op.v ? op.bg : 'white',
                    }}>
                    <div className="font-bold text-sm mb-0.5" style={{ color: form.urgencia === op.v ? op.color : '#374151' }}>{op.label}</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>{op.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {erro && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                <AlertTriangle size={16} style={{ color: '#DC2626' }} />
                <span className="text-sm" style={{ color: '#DC2626' }}>{erro}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #13293D 0%, #006494 100%)' }}>
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Wrench size={18} /> Enviar Solicitação</>}
            </button>

            <p className="text-center text-xs pb-4" style={{ color: '#9CA3AF' }}>
              Para emergências, procure a recepção imediatamente.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
