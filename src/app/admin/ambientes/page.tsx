'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Building2, Check, X } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Ambiente = { id: string; nome: string; tipo: string; capacidade: number | null; descricao: string | null; ativo: boolean }

const tiposCfg: Record<string, { label: string; color: string; bg: string }> = {
  quarto: { label: 'Quarto', color: '#006494', bg: '#E8F4F8' },
  salao: { label: 'Salão / Auditório', color: '#7C3AED', bg: '#F5F3FF' },
  area_externa: { label: 'Área Externa', color: '#059669', bg: '#ECFDF5' },
  servico: { label: 'Serviço', color: '#D97706', bg: '#FFFBEB' },
  administrativo: { label: 'Administrativo', color: '#6B7280', bg: '#F9FAFB' },
  lazer: { label: 'Lazer', color: '#0369A1', bg: '#EFF6FF' },
}

type Form = { nome: string; tipo: string; capacidade: string; descricao: string }
const formInicial: Form = { nome: '', tipo: 'salao', capacidade: '', descricao: '' }

export default function AmbientesPage() {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'novo' | 'editar' | null>(null)
  const [editando, setEditando] = useState<Ambiente | null>(null)
  const [form, setForm] = useState<Form>(formInicial)
  const [salvando, setSalvando] = useState(false)
  const sb = createSupabaseBrowser()

  async function carregar() {
    setLoading(true)
    const { data } = await sb.from('ambientes').select('*').order('tipo').order('nome')
    setAmbientes((data ?? []) as Ambiente[])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  function abrirNovo() { setForm(formInicial); setEditando(null); setModal('novo') }
  function abrirEditar(a: Ambiente) {
    setForm({ nome: a.nome, tipo: a.tipo, capacidade: a.capacidade?.toString() ?? '', descricao: a.descricao ?? '' })
    setEditando(a); setModal('editar')
  }

  async function salvar() {
    if (!form.nome.trim()) return
    setSalvando(true)
    const payload = { nome: form.nome.trim(), tipo: form.tipo, capacidade: form.capacidade ? parseInt(form.capacidade) : null, descricao: form.descricao || null }
    if (modal === 'novo') {
      await sb.from('ambientes').insert({ ...payload, ativo: true })
    } else if (editando) {
      await sb.from('ambientes').update(payload).eq('id', editando.id)
    }
    setSalvando(false); setModal(null); carregar()
  }

  async function toggleAtivo(a: Ambiente) {
    await sb.from('ambientes').update({ ativo: !a.ativo }).eq('id', a.id)
    setAmbientes(prev => prev.map(x => x.id === a.id ? { ...x, ativo: !x.ativo } : x))
  }

  async function remover(id: string) {
    if (!confirm('Remover este ambiente?')) return
    await sb.from('ambientes').delete().eq('id', id)
    setAmbientes(prev => prev.filter(a => a.id !== id))
  }

  const grupos = Object.entries(tiposCfg).map(([key, cfg]) => ({
    ...cfg, key, items: ambientes.filter(a => a.tipo === key),
  })).filter(g => g.items.length > 0)

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Ambientes do CATRE</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Gerencie todos os espaços e áreas do centro</p>
        </div>
        <button onClick={abrirNovo} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: '#006494' }}>
          <Plus size={18} /> Novo Ambiente
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {Object.entries(tiposCfg).map(([key, { label, color, bg }]) => {
          const count = ambientes.filter(a => a.tipo === key).length
          return (
            <div key={key} className="rounded-xl p-3 text-center border" style={{ borderColor: '#E5E7EB', background: count > 0 ? bg : 'white' }}>
              <div className="text-xl font-bold" style={{ color }}>{count}</div>
              <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{label}</div>
            </div>
          )
        })}
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm" style={{ color: '#9CA3AF' }}>Carregando...</div>
      ) : ambientes.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <Building2 size={48} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>Nenhum ambiente cadastrado ainda.</p>
          <button onClick={abrirNovo} className="text-sm font-semibold" style={{ color: '#006494' }}>+ Cadastrar primeiro ambiente</button>
        </div>
      ) : (
        <div className="space-y-6">
          {grupos.map(grupo => (
            <div key={grupo.key}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: grupo.bg, color: grupo.color }}>{grupo.label}</span>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>{grupo.items.length} ambientes</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {grupo.items.map(a => (
                  <div key={a.id} className="rounded-2xl p-5 border flex flex-col gap-3 transition-all" style={{ background: 'white', borderColor: a.ativo ? '#E5E7EB' : '#F3F4F6', opacity: a.ativo ? 1 : 0.55, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm" style={{ color: '#13293D' }}>{a.nome}</div>
                        {a.capacidade && <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Capacidade: {a.capacidade} pessoas</div>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => abrirEditar(a)} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil size={14} style={{ color: '#6B7280' }} /></button>
                        <button onClick={() => remover(a.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={14} style={{ color: '#EF4444' }} /></button>
                      </div>
                    </div>
                    {a.descricao && <p className="text-xs" style={{ color: '#6B7280' }}>{a.descricao}</p>}
                    <button onClick={() => toggleAtivo(a)} className="text-xs font-semibold px-3 py-1 rounded-lg w-fit"
                      style={{ background: a.ativo ? '#ECFDF5' : '#F9FAFB', color: a.ativo ? '#059669' : '#9CA3AF' }}>
                      {a.ativo ? '● Ativo' : '○ Inativo'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg" style={{ color: '#13293D' }}>{modal === 'novo' ? 'Novo Ambiente' : 'Editar Ambiente'}</h2>
              <button onClick={() => setModal(null)} style={{ color: '#9CA3AF' }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Nome do Ambiente *</label>
                <input type="text" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: Auditório Principal, Quarto 5..." autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Tipo</label>
                <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                  {Object.entries(tiposCfg).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Capacidade (pessoas)</label>
                <input type="number" min="1" value={form.capacidade} onChange={e => setForm(p => ({ ...p, capacidade: e.target.value }))}
                  placeholder="Opcional" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Descrição</label>
                <textarea rows={2} value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                  placeholder="Descrição opcional..." className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50" style={{ borderColor: '#E5E7EB', color: '#374151' }}>Cancelar</button>
              <button onClick={salvar} disabled={!form.nome.trim() || salvando}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: '#006494' }}>
                {salvando ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={15} /> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
