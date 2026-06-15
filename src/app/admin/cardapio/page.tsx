'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Coffee, Sun, Moon } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Item = { id: string; nome: string; tipo_refeicao: string; plano: number; descricao: string | null; disponivel: boolean; ordem: number }

const refeicoes = [
  { key: 'cafe', label: 'Desjejum', icon: Coffee, color: '#D97706', bg: '#FFFBEB' },
  { key: 'almoco', label: 'Almoço', icon: Sun, color: '#059669', bg: '#ECFDF5' },
  { key: 'jantar', label: 'Jantar', icon: Moon, color: '#7C3AED', bg: '#F5F3FF' },
]

const planos = [1, 2, 3, 4]

type NovoItem = { nome: string; tipo_refeicao: string; plano: number; descricao: string }
const novoItemInicial: NovoItem = { nome: '', tipo_refeicao: 'cafe', plano: 1, descricao: '' }

export default function CardapioPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('cafe')
  const [planoAtivo, setPlanoAtivo] = useState(1)
  const [novoItem, setNovoItem] = useState<NovoItem>(novoItemInicial)
  const [adicionando, setAdicionando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const sb = createSupabaseBrowser()

  async function carregar() {
    setLoading(true)
    const { data } = await sb.from('cardapio').select('*').order('plano').order('ordem')
    setItems((data ?? []) as Item[])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  async function adicionar() {
    if (!novoItem.nome.trim()) return
    setSalvando(true)
    const tipo = novoItem.tipo_refeicao
    const plano = novoItem.plano
    const maxOrdem = Math.max(0, ...items.filter(i => i.tipo_refeicao === tipo && i.plano === plano).map(i => i.ordem))
    await sb.from('cardapio').insert({
      nome: novoItem.nome.trim(), tipo_refeicao: tipo, plano,
      descricao: novoItem.descricao.trim() || null, disponivel: true, ordem: maxOrdem + 1,
    })
    setNovoItem(novoItemInicial)
    setAdicionando(false)
    setSalvando(false)
    carregar()
  }

  async function toggleDisponivel(id: string, atual: boolean) {
    await sb.from('cardapio').update({ disponivel: !atual }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, disponivel: !atual } : i))
  }

  async function remover(id: string) {
    if (!confirm('Remover este item do cardápio?')) return
    await sb.from('cardapio').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const aba = refeicoes.find(r => r.key === abaAtiva)!
  const itensDaAba = items.filter(i => i.tipo_refeicao === abaAtiva)
  const itensDoPlaNo = itensDaAba.filter(i => (i.plano ?? 1) === planoAtivo)

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Cardápio</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>4 planos por refeição — cardápio real do CATRE</p>
        </div>
        <button onClick={() => setAdicionando(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: '#006494' }}>
          <Plus size={18} /> Adicionar Item
        </button>
      </div>

      {/* Abas de refeição */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {refeicoes.map(({ key, label, icon: Icon, color, bg }) => {
          const count = items.filter(i => i.tipo_refeicao === key).length
          const ativo = abaAtiva === key
          return (
            <button key={key} onClick={() => { setAbaAtiva(key); setPlanoAtivo(1) }}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
              style={{ borderColor: ativo ? color : '#E5E7EB', background: ativo ? bg : 'white' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: ativo ? color : '#F3F4F6' }}>
                <Icon size={18} style={{ color: ativo ? 'white' : '#9CA3AF' }} />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: ativo ? color : '#374151' }}>{label}</div>
                <div className="text-xs" style={{ color: '#9CA3AF' }}>{count} itens · 4 planos</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Sub-abas de plano */}
      <div className="flex gap-2 mb-4">
        {planos.map(p => (
          <button key={p} onClick={() => setPlanoAtivo(p)}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: planoAtivo === p ? aba.color : 'white',
              color: planoAtivo === p ? 'white' : '#374151',
              border: planoAtivo === p ? 'none' : '1px solid #E5E7EB',
            }}>
            Plano {p}
            <span className="ml-1.5 text-xs opacity-70">
              ({itensDaAba.filter(i => (i.plano ?? 1) === p).length})
            </span>
          </button>
        ))}
      </div>

      {/* Lista de itens */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: '#F3F4F6', background: aba.bg }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: aba.color }}>
            <aba.icon size={16} style={{ color: 'white' }} />
          </div>
          <h2 className="font-bold" style={{ color: aba.color }}>{aba.label} — Plano {planoAtivo}</h2>
          <span className="text-sm ml-auto" style={{ color: '#9CA3AF' }}>{itensDoPlaNo.length} itens</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm" style={{ color: '#9CA3AF' }}>Carregando...</div>
        ) : itensDoPlaNo.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>Nenhum item para {aba.label} Plano {planoAtivo}.</p>
            <button onClick={() => { setNovoItem({ nome: '', tipo_refeicao: abaAtiva, plano: planoAtivo, descricao: '' }); setAdicionando(true) }}
              className="text-sm font-semibold" style={{ color: '#006494' }}>
              + Adicionar item
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {itensDoPlaNo.map(item => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4 group">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold"
                    style={{ color: item.disponivel ? '#13293D' : '#9CA3AF', textDecoration: item.disponivel ? 'none' : 'line-through' }}>
                    {item.nome}
                  </div>
                  {item.descricao && <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{item.descricao}</div>}
                </div>
                <button onClick={() => toggleDisponivel(item.id, item.disponivel)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: item.disponivel ? '#ECFDF5' : '#F9FAFB', color: item.disponivel ? '#059669' : '#9CA3AF' }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: item.disponivel ? '#059669' : '#D1D5DB' }} />
                  {item.disponivel ? 'Disponível' : 'Indisponível'}
                </button>
                <button onClick={() => remover(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all hover:bg-red-50"
                  style={{ color: '#EF4444' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal adicionar */}
      {adicionando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setAdicionando(false) }}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 className="font-bold text-lg mb-5" style={{ color: '#13293D' }}>Adicionar Item ao Cardápio</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Refeição</label>
                  <select value={novoItem.tipo_refeicao} onChange={e => setNovoItem(p => ({ ...p, tipo_refeicao: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                    {refeicoes.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Plano</label>
                  <select value={novoItem.plano} onChange={e => setNovoItem(p => ({ ...p, plano: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                    {planos.map(p => <option key={p} value={p}>Plano {p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Nome do item *</label>
                <input type="text" value={novoItem.nome} onChange={e => setNovoItem(p => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: Arroz integral" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }} autoFocus />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Descrição (opcional)</label>
                <input type="text" value={novoItem.descricao} onChange={e => setNovoItem(p => ({ ...p, descricao: e.target.value }))}
                  placeholder="Detalhes do item" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAdicionando(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#374151' }}>Cancelar</button>
              <button onClick={adicionar} disabled={!novoItem.nome.trim() || salvando}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                style={{ background: '#006494' }}>
                {salvando ? 'Salvando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
