'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, AlertTriangle, X } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIAS } from '@/lib/types'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Quarto = { id: string; numero: number | null; nome: string; localizacao: string; capacidade: number; climatizacao: string }

const prioridades = [
  { value: 'baixa', label: 'Baixa', color: '#22C55E', desc: 'Pode aguardar a próxima semana' },
  { value: 'media', label: 'Média', color: '#F59E0B', desc: 'Resolver nos próximos dias' },
  { value: 'alta', label: 'Alta', color: '#F97316', desc: 'Resolver ainda hoje' },
  { value: 'urgente', label: 'Urgente', color: '#EF4444', desc: 'Resolver imediatamente' },
]

export default function NovoChamado() {
  const router = useRouter()
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [quartosSelected, setQuartosSelected] = useState<string[]>([])
  const [localManual, setLocalManual] = useState('')
  const [useQuartosList, setUseQuartosList] = useState(true)
  const [form, setForm] = useState({
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    local: '',
    categoriaGrupo: '',
    categoriaItem: '',
    descricao: '',
    prioridade: 'media',
    responsavel: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const sb = createSupabaseBrowser()
    sb.from('quartos').select('id, numero, nome, localizacao, capacidade, climatizacao').eq('ativo', true).order('numero')
      .then(({ data }) => { if (data) setQuartos(data as Quarto[]) })
  }, [])

  const subitens = form.categoriaGrupo ? CATEGORIAS[form.categoriaGrupo as keyof typeof CATEGORIAS] ?? [] : []

  function toggleQuarto(id: string) {
    setQuartosSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function getLocalFinal() {
    if (!useQuartosList) return localManual
    if (quartosSelected.length === 0) return localManual
    const nomes = quartos.filter(q => quartosSelected.includes(q.id)).map(q => q.nome)
    return nomes.join(', ') + (localManual ? ` — ${localManual}` : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const localFinal = getLocalFinal()
    const sb = createSupabaseBrowser()
    await sb.from('manutencao_chamados').insert({
      data: form.data, hora: form.hora,
      local: localFinal || form.local,
      categoria: [form.categoriaGrupo, form.categoriaItem].filter(Boolean).join(' — ') || 'Geral',
      descricao: form.descricao, prioridade: form.prioridade,
      responsavel: form.responsavel || null, status: 'aberto',
    })
    setSaving(false)
    router.push('/admin/manutencao')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/manutencao"
          className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB' }}
        >
          <ArrowLeft size={18} style={{ color: '#374151' }} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#13293D' }}>Abrir Chamado de Manutenção</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>Preencha todas as informações do problema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data e Hora */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
        >
          <h2 className="font-semibold mb-4" style={{ color: '#13293D' }}>Data e Hora</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Data *</label>
              <input
                type="date"
                required
                value={form.data}
                onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB', color: '#13293D' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Hora *</label>
              <input
                type="time"
                required
                value={form.hora}
                onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB', color: '#13293D' }}
              />
            </div>
          </div>
        </div>

        {/* Local e Categoria */}
        <div className="rounded-xl p-5" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <h2 className="font-semibold mb-4" style={{ color: '#13293D' }}>Local e Categoria</h2>
          <div className="space-y-4">
            {/* Toggle modo */}
            <div className="flex rounded-xl border overflow-hidden w-fit" style={{ borderColor: '#E5E7EB' }}>
              <button type="button" onClick={() => setUseQuartosList(true)}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{ background: useQuartosList ? '#006494' : 'white', color: useQuartosList ? 'white' : '#374151' }}>
                Selecionar Quartos
              </button>
              <button type="button" onClick={() => setUseQuartosList(false)}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{ background: !useQuartosList ? '#006494' : 'white', color: !useQuartosList ? 'white' : '#374151' }}>
                Digitar Local
              </button>
            </div>

            {useQuartosList ? (
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#374151' }}>
                  Selecione os quartos / áreas afetados (pode selecionar vários)
                </label>
                {quartosSelected.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {quartosSelected.map(id => {
                      const q = quartos.find(x => x.id === id)
                      return q ? (
                        <span key={id} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: '#E8F4F8', color: '#006494' }}>
                          {q.nome}
                          <button type="button" onClick={() => toggleQuarto(id)}><X size={12} /></button>
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {quartos.map(q => {
                    const sel = quartosSelected.includes(q.id)
                    return (
                      <button key={q.id} type="button" onClick={() => toggleQuarto(q.id)}
                        className="text-left px-3 py-2 rounded-lg border text-xs transition-all"
                        style={{
                          borderColor: sel ? '#006494' : '#E5E7EB',
                          background: sel ? '#E8F4F8' : 'white',
                          color: sel ? '#006494' : '#374151',
                        }}>
                        <div className="font-semibold">{q.nome}</div>
                        <div className="opacity-60 text-[10px]">{q.climatizacao === 'ar_condicionado' ? 'A/C' : 'Vent.'} · {q.capacidade} leitos</div>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Complemento (opcional)</label>
                  <input type="text" value={localManual} onChange={e => setLocalManual(e.target.value)}
                    placeholder="Ex: Banheiro, janela, tomada..." className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Local *</label>
                <input type="text" required placeholder="Ex: Quarto 12, Banheiro Bloco A, Piscina..."
                  value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
            )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Categoria *</label>
                <select
                  required
                  value={form.categoriaGrupo}
                  onChange={e => setForm(f => ({ ...f, categoriaGrupo: e.target.value, categoriaItem: '' }))}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }}
                >
                  <option value="">Selecione...</option>
                  {Object.keys(CATEGORIAS).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Tipo</label>
                <select
                  value={form.categoriaItem}
                  onChange={e => setForm(f => ({ ...f, categoriaItem: e.target.value }))}
                  disabled={!form.categoriaGrupo}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none disabled:opacity-50"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }}
                >
                  <option value="">Selecione...</option>
                  {subitens.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

        {/* Descrição */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
        >
          <h2 className="font-semibold mb-4" style={{ color: '#13293D' }}>Descrição do Problema</h2>
          <textarea
            required
            rows={4}
            placeholder="Descreva o problema com o máximo de detalhes possível..."
            value={form.descricao}
            onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none"
            style={{ borderColor: '#E5E7EB', color: '#13293D' }}
          />
        </div>

        {/* Prioridade */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
        >
          <h2 className="font-semibold mb-4" style={{ color: '#13293D' }}>Prioridade</h2>
          <div className="grid grid-cols-2 gap-3">
            {prioridades.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, prioridade: p.value }))}
                className="flex items-start gap-3 p-3 rounded-xl text-left transition-all border-2"
                style={{
                  borderColor: form.prioridade === p.value ? p.color : '#E5E7EB',
                  background: form.prioridade === p.value ? `${p.color}10` : 'white',
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: p.color }}
                />
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#13293D' }}>{p.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{p.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {form.prioridade === 'urgente' && (
            <div
              className="mt-3 flex items-center gap-2 p-3 rounded-lg"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
            >
              <AlertTriangle size={16} style={{ color: '#EF4444' }} />
              <p className="text-xs" style={{ color: '#DC2626' }}>
                Chamados urgentes notificam a equipe imediatamente.
              </p>
            </div>
          )}
        </div>

        {/* Responsável e Fotos */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
        >
          <h2 className="font-semibold mb-4" style={{ color: '#13293D' }}>Informações Adicionais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Responsável (opcional)</label>
              <input
                type="text"
                placeholder="Nome do responsável pela execução"
                value={form.responsavel}
                onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#E5E7EB', color: '#13293D' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Fotos</label>
              <div
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#E5E7EB' }}
              >
                <Upload size={24} className="mx-auto mb-2" style={{ color: '#9CA3AF' }} />
                <p className="text-sm" style={{ color: '#6B7280' }}>Clique para adicionar fotos</p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>PNG, JPG até 10MB cada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: '#006494' }}
          >
            {saving ? 'Registrando...' : 'Registrar Chamado'}
          </button>
          <Link
            href="/admin/manutencao"
            className="px-6 py-3 rounded-xl font-semibold border text-sm flex items-center transition-all hover:bg-gray-50"
            style={{ borderColor: '#E5E7EB', color: '#374151' }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
