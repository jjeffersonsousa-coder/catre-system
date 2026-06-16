'use client'
import { useEffect, useState } from 'react'
import { Plus, List, Calendar, X, Check, ChevronLeft, ChevronRight, Eye, Pencil, History, BedDouble, Copy, Link2, UserPlus, Trash2, FileText, Wrench } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Historico = { id: string; alteracoes: Record<string, { antes: string; depois: string }>; usuario: string; created_at: string }
type Quarto = { id: string; nome: string; localizacao: string; capacidade: number; climatizacao: string }
type ReservaQuarto = { id: string; quarto_id: string; hospedes: string[] }
type ReservaCardapio = { data: string; desjejum_plano: number; almoco_plano: number; jantar_plano: number }

type Reserva = {
  id: string; created_at: string; nome: string; email: string; telefone: string
  igreja: string; nome_evento: string | null; tipo_evento: string; data_inicio: string; data_fim: string
  hospedes: number; refeicoes: boolean; mensagem: string | null
  status: string; observacao_interna: string | null; valor_total: number | null; token: string | null
  tipo_diaria: string | null; criancas_isentas: number | null
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
  const [abaDetalhe, setAbaDetalhe] = useState<'info' | 'quartos' | 'historico'>('info')
  const [editando, setEditando] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Reserva>>({})
  const [historico, setHistorico] = useState<Historico[]>([])
  const [quartosList, setQuartosList] = useState<Quarto[]>([])
  const [reservaQuartos, setReservaQuartos] = useState<ReservaQuarto[]>([])
  const [reservaCardapio, setReservaCardapio] = useState<ReservaCardapio[]>([])
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [editTipoDiaria, setEditTipoDiaria] = useState('sem_roupa')
  const [editCriancas, setEditCriancas] = useState('0')
  const [propostaModal, setPropostaModal] = useState(false)
  const [propostaTipoDiaria, setPropostaTipoDiaria] = useState('sem_roupa')
  const [propostaCriancas, setPropostaCriancas] = useState('0')
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
      tipo_diaria: nova.tipo_diaria,
      criancas_isentas: parseInt(nova.criancas_isentas) || 0,
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

  async function abrirDetalhe(r: Reserva) {
    setSelecionada(r)
    setAbaDetalhe('info')
    setEditando(false)
    const [{ data: hist }, { data: qts }, { data: rq }, { data: rc }] = await Promise.all([
      sb.from('reservas_historico').select('*').eq('reserva_id', r.id).order('created_at', { ascending: false }),
      sb.from('quartos').select('id,nome,localizacao,capacidade,climatizacao').eq('ativo', true).order('numero'),
      sb.from('reserva_quartos').select('id,quarto_id,hospedes').eq('reserva_id', r.id),
      sb.from('reserva_cardapio').select('data,desjejum_plano,almoco_plano,jantar_plano').eq('reserva_id', r.id).order('data'),
    ])
    setHistorico((hist ?? []) as Historico[])
    setQuartosList((qts ?? []) as Quarto[])
    setReservaQuartos(((rq ?? []) as { id: string; quarto_id: string; hospedes: string[] | null }[]).map(x => ({ ...x, hospedes: x.hospedes ?? [] })))
    setReservaCardapio((rc ?? []) as ReservaCardapio[])
  }

  async function toggleQuartoReserva(quartoId: string) {
    if (!selecionada) return
    const existente = reservaQuartos.find(rq => rq.quarto_id === quartoId)
    if (existente) {
      await sb.from('reserva_quartos').delete().eq('id', existente.id)
      setReservaQuartos(prev => prev.filter(rq => rq.quarto_id !== quartoId))
    } else {
      const { data } = await sb.from('reserva_quartos').insert({ reserva_id: selecionada.id, quarto_id: quartoId, hospedes: [] }).select().single()
      if (data) setReservaQuartos(prev => [...prev, { id: data.id, quarto_id: quartoId, hospedes: [] }])
    }
  }

  async function atualizarHospedesQuarto(rqId: string, hospedes: string[]) {
    await sb.from('reserva_quartos').update({ hospedes }).eq('id', rqId)
    setReservaQuartos(prev => prev.map(rq => rq.id === rqId ? { ...rq, hospedes } : rq))
  }

  function getLinkPublico(token: string | null) {
    if (!token) return ''
    return `${window.location.origin}/reserva/${token}/quartos`
  }

  async function copiarLink() {
    if (!selecionada?.token) return
    await navigator.clipboard.writeText(getLinkPublico(selecionada.token))
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2500)
  }

  function imprimirQuartos(apenasQuartoId?: string) {
    if (!selecionada) return
    const lista = apenasQuartoId
      ? reservaQuartos.filter(rq => rq.quarto_id === apenasQuartoId)
      : reservaQuartos
    const cores = ['#006494', '#F97316']
    const cartoes = lista.map(rq => {
      const q = quartosList.find(x => x.id === rq.quarto_id)
      if (!q) return ''
      const nomes = rq.hospedes.filter(n => n.trim())
      const linhas = nomes.length > 0
        ? nomes.map((n, i) => `<div class="hospede" style="color:${cores[i % 2]}">${i + 1}. ${n}</div>`).join('')
        : '<div class="vazio">Nenhum hóspede cadastrado</div>'
      return `
        <div class="quarto">
          <div class="quarto-header">
            <span class="quarto-nome">${q.nome}</span>
            <span class="quarto-info">${q.climatizacao === 'ar_condicionado' ? '❄️ A/C' : '🌀 Ventilador'} · ${nomes.length}/${q.capacidade} hóspedes</span>
          </div>
          <div class="hospedes">${linhas}</div>
        </div>`
    }).join('')

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Quartos — ${selecionada.nome_evento || selecionada.tipo_evento}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #F5F7FA; color: #13293D; padding: 32px; }
  .cabecalho { background: linear-gradient(135deg, #13293D 0%, #006494 100%); color: white; border-radius: 16px; padding: 24px 32px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; }
  .cabecalho-esq { }
  .cabecalho-org { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7; margin-bottom: 4px; }
  .cabecalho-evento { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .cabecalho-datas { font-size: 12px; opacity: 0.8; }
  .cabecalho-dir { text-align: right; font-size: 11px; opacity: 0.7; line-height: 1.8; }
  .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .quarto { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); break-inside: avoid; }
  .quarto-header { background: #13293D; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
  .quarto-nome { color: white; font-size: 15px; font-weight: 800; letter-spacing: 0.5px; }
  .quarto-info { color: rgba(255,255,255,0.65); font-size: 11px; }
  .hospedes { padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; }
  .hospede { font-size: 14px; font-weight: 600; padding: 6px 12px; border-radius: 8px; background: rgba(0,0,0,0.03); }
  .vazio { font-size: 13px; color: #9CA3AF; font-style: italic; padding: 8px 0; }
  .rodape { margin-top: 28px; text-align: center; font-size: 11px; color: #9CA3AF; }
  @media print {
    body { background: white; padding: 16px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .quarto { box-shadow: none; border: 1px solid #E5E7EB; }
    .cabecalho { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 1.5cm; size: A4; }
  }
</style></head><body>
<div class="cabecalho">
  <div class="cabecalho-esq">
    <div class="cabecalho-org">CATRE — Associação Rio Sul</div>
    <div class="cabecalho-evento">${selecionada.nome_evento || selecionada.tipo_evento}</div>
    <div class="cabecalho-datas">📅 ${fmt(selecionada.data_inicio)} → ${fmt(selecionada.data_fim)} &nbsp;·&nbsp; 👥 ${selecionada.hospedes} hóspedes</div>
  </div>
  <div class="cabecalho-dir">
    Responsável: ${selecionada.nome}<br>
    ${selecionada.igreja}<br>
    Gerado em ${new Date().toLocaleDateString('pt-BR')}
  </div>
</div>
<div class="grade">${cartoes}</div>
<div class="rodape">CATRE — Centro Adventista de Treinamento · Itatiaia, RJ</div>
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
  }

  function abrirEdicao() {
    if (!selecionada) return
    setEditForm({ ...selecionada })
    setEditTipoDiaria(selecionada.tipo_diaria ?? 'sem_roupa')
    setEditCriancas(String(selecionada.criancas_isentas ?? 0))
    setEditando(true)
  }

  function calcularValorEdicao(): number {
    if (!editForm.data_inicio || !editForm.data_fim || !editForm.hospedes) return 0
    const td = tiposDiaria.find(t => t.key === editTipoDiaria)
    if (!td) return 0
    const nts = noites(editForm.data_inicio, editForm.data_fim)
    const hospedes = Number(editForm.hospedes) || 0
    const criancas = parseInt(editCriancas) || 0
    const pagantes = Math.max(0, hospedes - criancas)
    if (nts <= 0 || hospedes <= 0) return 0
    return td.porPessoa ? td.valor * pagantes * nts : td.valor
  }

  function abrirPropostaModal() {
    if (!selecionada) return
    setPropostaTipoDiaria(selecionada.tipo_diaria ?? 'sem_roupa')
    setPropostaCriancas(String(selecionada.criancas_isentas ?? 0))
    setPropostaModal(true)
  }

  async function gerarProposta() {
    if (!selecionada) return
    setPropostaModal(false)
    const nts = noites(selecionada.data_inicio, selecionada.data_fim)
    const td = tiposDiaria.find(t => t.key === propostaTipoDiaria)
    const criancas = parseInt(propostaCriancas) || 0
    const pagantes = Math.max(0, selecionada.hospedes - criancas)

    // Recalcula o valor com os parâmetros selecionados
    let valorCalculado = 0
    if (td) {
      valorCalculado = td.porPessoa ? td.valor * pagantes * nts : td.valor
    }
    if (selecionada.refeicoes) {
      const dias = diasEntre(selecionada.data_inicio, selecionada.data_fim).length
      valorCalculado += PRECO_REFEICAO * pagantes * 3 * dias
    }
    const valor = selecionada.valor_total ?? valorCalculado

    // Fetch cardápio items for the days
    const { data: cardapioItems } = await sb.from('cardapio').select('tipo_refeicao,plano,nome,descricao').eq('ativo', true)
    const getItem = (tipo: string, plano: number) => {
      const item = (cardapioItems ?? []).find((c: { tipo_refeicao: string; plano: number; nome: string; descricao: string }) => c.tipo_refeicao === tipo && c.plano === plano)
      return item ? `<strong>${item.nome}</strong>${item.descricao ? ` — ${item.descricao}` : ''}` : `Plano ${plano}`
    }

    const diasCardapio = reservaCardapio.length > 0 ? reservaCardapio.map(rc => {
      const dFmt = new Date(rc.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
      return `
        <div class="dia-cardapio">
          <div class="dia-titulo">${dFmt}</div>
          <div class="refeicoes-grid">
            <div class="refeicao"><span class="refeicao-icon">☕</span><div><div class="refeicao-nome">Desjejum</div><div class="refeicao-desc">${getItem('cafe', rc.desjejum_plano)}</div></div></div>
            <div class="refeicao"><span class="refeicao-icon">☀️</span><div><div class="refeicao-nome">Almoço</div><div class="refeicao-desc">${getItem('almoco', rc.almoco_plano)}</div></div></div>
            <div class="refeicao"><span class="refeicao-icon">🌙</span><div><div class="refeicao-nome">Jantar</div><div class="refeicao-desc">${getItem('jantar', rc.jantar_plano)}</div></div></div>
          </div>
        </div>`
    }).join('') : ''

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Proposta — ${selecionada.nome_evento || selecionada.tipo_evento}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #F5F7FA; color: #13293D; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px 32px; }
  .header { background: linear-gradient(135deg, #13293D 0%, #006494 100%); border-radius: 20px; padding: 36px 40px; margin-bottom: 32px; color: white; display: flex; justify-content: space-between; align-items: flex-start; }
  .header-org { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px; }
  .header-titulo { font-size: 28px; font-weight: 900; margin-bottom: 4px; }
  .header-tipo { font-size: 14px; opacity: 0.75; }
  .header-badge { background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px 16px; text-align: right; font-size: 12px; line-height: 2; }
  .card { background: white; border-radius: 16px; padding: 28px 32px; margin-bottom: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .card-titulo { font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #006494; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .card-titulo::before { content: ''; display: inline-block; width: 3px; height: 16px; background: #F97316; border-radius: 2px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .info-item label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; display: block; margin-bottom: 4px; }
  .info-item span { font-size: 14px; color: #13293D; font-weight: 500; }
  .boas-vindas { font-size: 14px; line-height: 1.8; color: #374151; }
  .checkin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .checkin-box { background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 16px; text-align: center; }
  .checkin-box .hora { font-size: 32px; font-weight: 900; color: #006494; }
  .checkin-box .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0369A1; margin-top: 4px; }
  .regras { list-style: none; space-y: 8px; }
  .regras li { font-size: 13px; color: #374151; padding: 6px 0; border-bottom: 1px solid #F3F4F6; display: flex; gap: 8px; }
  .regras li::before { content: '→'; color: #F97316; font-weight: 700; flex-shrink: 0; }
  .dia-cardapio { margin-bottom: 16px; }
  .dia-titulo { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #006494; padding: 8px 0; border-bottom: 2px solid #E8F4F8; margin-bottom: 10px; }
  .refeicoes-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .refeicao { display: flex; gap: 8px; align-items: flex-start; background: #F9FAFB; border-radius: 10px; padding: 10px; }
  .refeicao-icon { font-size: 18px; flex-shrink: 0; }
  .refeicao-nome { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 3px; }
  .refeicao-desc { font-size: 12px; color: #374151; line-height: 1.4; }
  .financeiro { }
  .fin-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #374151; }
  .fin-row:last-child { border-bottom: none; }
  .fin-total { display: flex; justify-content: space-between; padding: 16px 20px; background: linear-gradient(135deg, #13293D, #006494); border-radius: 12px; margin-top: 12px; }
  .fin-total-label { color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 600; }
  .fin-total-valor { color: white; font-size: 24px; font-weight: 900; }
  .footer { text-align: center; padding: 24px; font-size: 11px; color: #9CA3AF; line-height: 2; }
  .print-btn { position: fixed; top: 20px; right: 20px; background: #006494; color: white; border: none; border-radius: 12px; padding: 12px 24px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(0,100,148,0.4); z-index: 999; }
  .print-btn:hover { background: #13293D; }
  .edit-hint { position: fixed; top: 20px; left: 20px; background: #F97316; color: white; border-radius: 12px; padding: 10px 16px; font-size: 12px; font-weight: 600; z-index: 999; }
  @media print {
    .print-btn, .edit-hint { display: none !important; }
    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 0; }
    .card { box-shadow: none; border: 1px solid #E5E7EB; }
    .header { border-radius: 12px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .fin-total { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .checkin-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 1.5cm; size: A4; }
  }
  [contenteditable]:focus { outline: 2px dashed #F97316; border-radius: 4px; }
</style></head><body>
<button class="edit-hint">✏️ Clique em qualquer texto para editar</button>
<button class="print-btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
<div class="page">
  <!-- CABEÇALHO -->
  <div class="header">
    <div>
      <div class="header-org">CATRE — Centro Adventista de Treinamento · ARS</div>
      <div class="header-titulo" contenteditable="true">${selecionada.nome_evento || selecionada.tipo_evento}</div>
      <div class="header-tipo" contenteditable="true">${selecionada.tipo_evento}</div>
    </div>
    <div class="header-badge">
      <div>📅 ${fmt(selecionada.data_inicio)} → ${fmt(selecionada.data_fim)}</div>
      <div>🌙 ${nts} noite(s)</div>
      <div>👥 ${selecionada.hospedes} hóspedes</div>
    </div>
  </div>

  <!-- BOAS-VINDAS -->
  <div class="card">
    <div class="card-titulo">Carta de Boas-Vindas</div>
    <div class="boas-vindas" contenteditable="true">
      <p>Prezado(a) <strong>${selecionada.nome}</strong>,</p><br>
      <p>É com grande alegria que recebemos o seu grupo no <strong>CATRE — Centro Adventista de Treinamento</strong> da Associação Rio Sul.</p><br>
      <p>Nosso espaço foi pensado para proporcionar um ambiente acolhedor, seguro e inspirador para a realização do seu evento. Contamos com toda uma estrutura preparada com carinho para que a experiência de vocês seja inesquecível.</p><br>
      <p>Nossa equipe está à disposição para auxiliar no que for necessário durante toda a estadia. Desejamos que este seja um momento de crescimento, comunhão e bênçãos para todos.</p><br>
      <p>Seja bem-vindo(a)!</p><br>
      <p style="color:#9CA3AF; font-size:13px">Equipe CATRE — ARS · Itatiaia, RJ</p>
    </div>
  </div>

  <!-- INFORMAÇÕES DO EVENTO -->
  <div class="card">
    <div class="card-titulo">Informações do Evento</div>
    <div class="info-grid">
      <div class="info-item"><label>Responsável</label><span contenteditable="true">${selecionada.nome}</span></div>
      <div class="info-item"><label>Igreja / Organização</label><span contenteditable="true">${selecionada.igreja}</span></div>
      <div class="info-item"><label>E-mail</label><span contenteditable="true">${selecionada.email}</span></div>
      <div class="info-item"><label>Telefone</label><span contenteditable="true">${selecionada.telefone}</span></div>
      <div class="info-item"><label>Tipo de Evento</label><span contenteditable="true">${selecionada.tipo_evento}</span></div>
      <div class="info-item"><label>Período</label><span contenteditable="true">${fmt(selecionada.data_inicio)} → ${fmt(selecionada.data_fim)} (${nts} noites)</span></div>
      <div class="info-item"><label>Total de Hóspedes</label><span contenteditable="true">${selecionada.hospedes} pessoas</span></div>
      <div class="info-item"><label>Alimentação Inclusa</label><span contenteditable="true">${selecionada.refeicoes ? 'Sim' : 'Não'}</span></div>
    </div>
  </div>

  <!-- CHECK-IN / CHECK-OUT -->
  <div class="card">
    <div class="card-titulo">Horários de Check-in e Check-out</div>
    <div class="checkin-grid">
      <div class="checkin-box">
        <div class="hora" contenteditable="true">14:00</div>
        <div class="label">✅ Check-in</div>
      </div>
      <div class="checkin-box">
        <div class="hora" contenteditable="true">12:00</div>
        <div class="label">🔑 Check-out</div>
      </div>
    </div>
    <ul class="regras" style="margin-top:16px" contenteditable="true">
      <li>O check-in será realizado a partir das 15h, se o evento iniciar à noite, ou às 10h se o evento iniciar com o almoço.</li>
      <li>Não é permitida a entrada de pessoas não cadastradas nas acomodações.</li>
      <li>O check-out deve ser realizado até o horário indicado para a equipe ter tempo hábil para preparar o ambiente.</li>
      <li>Nosso espaço não é pet friendly, portanto, não aceitamos animais de estimação.</li>
    </ul>
  </div>

  ${diasCardapio ? `
  <!-- CARDÁPIO -->
  <div class="card">
    <div class="card-titulo">Cardápio por Dia</div>
    ${diasCardapio}
  </div>` : ''}

  <!-- FINANCEIRO -->
  <div class="card">
    <div class="card-titulo">Resumo Financeiro</div>
    <div class="financeiro">
      ${td && td.porPessoa ? `
      <div class="fin-row">
        <span>🏠 ${td.label}</span>
        <span>${pagantes} pessoa(s) pagantes × ${nts} noite(s) × R$ ${td.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} = <strong>R$ ${(td.valor * pagantes * nts).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
      </div>` : td ? `
      <div class="fin-row">
        <span>🏠 ${td.label}</span>
        <span>Pacote fixo — <strong>R$ ${td.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
      </div>` : ''}
      ${criancas > 0 ? `
      <div class="fin-row">
        <span>👶 Crianças até 7 anos (isentas)</span>
        <span>${criancas} criança(s) — <strong>R$ 0,00</strong></span>
      </div>` : ''}
      ${selecionada.refeicoes ? `
      <div class="fin-row">
        <span>🍽️ Alimentação (3 refeições/dia)</span>
        <span>${pagantes} pessoa(s) × ${diasEntre(selecionada.data_inicio, selecionada.data_fim).length} dia(s) × 3 ref. × R$ ${PRECO_REFEICAO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} = <strong>R$ ${(PRECO_REFEICAO * pagantes * 3 * diasEntre(selecionada.data_inicio, selecionada.data_fim).length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
      </div>` : ''}
    </div>
    <div class="fin-total">
      <span class="fin-total-label">Valor Total do Evento</span>
      <span class="fin-total-valor" contenteditable="true">R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
    </div>
    <p style="font-size:12px; color:#9CA3AF; margin-top:12px; text-align:center" contenteditable="true">
      Este documento é uma proposta oficial. Para dúvidas, entre em contato: (24) 3551-1223 · tesouraria.ars@adventistas.org
    </p>
  </div>

  <div class="footer">
    CATRE — Centro Adventista de Treinamento<br>
    Associação Rio Sul da Igreja Adventista do Sétimo Dia · Itatiaia, RJ<br>
    Proposta gerada em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
  </div>
</div>
</body></html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
  }

  async function salvarEdicao() {
    if (!selecionada || !editForm) return
    setSalvando(true)

    const rotulos: Record<string, string> = {
      nome: 'Nome', email: 'E-mail', telefone: 'Telefone', igreja: 'Igreja/Org.',
      nome_evento: 'Nome do Evento', tipo_evento: 'Tipo de Evento',
      data_inicio: 'Chegada', data_fim: 'Saída', hospedes: 'Hóspedes',
      status: 'Status', valor_total: 'Valor Total', observacao_interna: 'Obs. Interna',
      refeicoes: 'Alimentação', mensagem: 'Mensagem',
    }

    const alteracoes: Record<string, { antes: string; depois: string }> = {}
    for (const key of Object.keys(rotulos) as (keyof Reserva)[]) {
      const antes = String(selecionada[key] ?? '')
      const depois = String(editForm[key] ?? '')
      if (antes !== depois) {
        alteracoes[rotulos[key]] = { antes, depois }
      }
    }

    await sb.from('reservas').update(editForm).eq('id', selecionada.id)

    if (Object.keys(alteracoes).length > 0) {
      await sb.from('reservas_historico').insert({
        reserva_id: selecionada.id,
        alteracoes,
        usuario: 'Gestor',
      })
    }

    setSalvando(false)
    setEditando(false)
    const updated = { ...selecionada, ...editForm } as Reserva
    setSelecionada(updated)
    setReservas(prev => prev.map(r => r.id === updated.id ? updated : r))
    // Recarrega historico
    const { data } = await sb.from('reservas_historico').select('*').eq('reserva_id', selecionada.id).order('created_at', { ascending: false })
    setHistorico((data ?? []) as Historico[])
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
                          <button onClick={() => abrirDetalhe(r)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80" style={{ background: '#EFF6FF', color: '#006494' }}>
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
                    <button key={r.id} onClick={() => abrirDetalhe(r)}
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

      {/* Modal detalhes / edição */}
      {selecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) { setSelecionada(null); setEditando(false) } }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: '#F3F4F6' }}>
              <div className="flex items-center gap-3">
                <span className="text-sm px-3 py-1 rounded-full font-bold" style={{ background: statusCfg[selecionada.status]?.bg, color: statusCfg[selecionada.status]?.color }}>
                  {statusCfg[selecionada.status]?.label}
                </span>
                <h2 className="font-bold text-base" style={{ color: '#13293D' }}>
                  {selecionada.nome_evento || selecionada.nome}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {!editando && (
                  <button onClick={abrirEdicao} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: '#EFF6FF', color: '#006494' }}>
                    <Pencil size={13} /> Editar
                  </button>
                )}
                <button onClick={() => { setSelecionada(null); setEditando(false) }} style={{ color: '#9CA3AF' }}><X size={20} /></button>
              </div>
            </div>

            {/* Abas */}
            {!editando && (
              <div className="flex border-b flex-shrink-0" style={{ borderColor: '#F3F4F6' }}>
                {([
                  ['info', 'Informações', null],
                  ['quartos', 'Distribuição de Quartos', reservaQuartos.length],
                  ['historico', 'Histórico', historico.length],
                ] as [string, string, number | null][]).map(([k, label, count]) => (
                  <button key={k} onClick={() => setAbaDetalhe(k as 'info' | 'quartos' | 'historico')}
                    className="px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5"
                    style={{ borderColor: abaDetalhe === k ? '#006494' : 'transparent', color: abaDetalhe === k ? '#006494' : '#9CA3AF' }}>
                    {k === 'quartos' && <BedDouble size={14} />}
                    {k === 'historico' && <History size={14} />}
                    {label}
                    {count !== null && count > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#EFF6FF', color: '#006494' }}>{count}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Conteúdo */}
            <div className="overflow-y-auto flex-1 p-6">

              {/* Aba Informações */}
              {!editando && abaDetalhe === 'info' && (
                <div className="space-y-4">
                  {/* Botões de ação */}
                  <div className="flex gap-2">
                    <button onClick={abrirPropostaModal}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: '#13293D', color: 'white' }}>
                      <FileText size={15} /> Gerar Proposta / PDF
                    </button>
                    <a href="/manutencao/solicitar" target="_blank"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: '#F97316', color: 'white' }}>
                      <Wrench size={15} /> Link de Manutenção
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { l: 'Responsável', v: selecionada.nome }, { l: 'Igreja / Org.', v: selecionada.igreja },
                      { l: 'E-mail', v: selecionada.email }, { l: 'Telefone', v: selecionada.telefone },
                      { l: 'Nome do Evento', v: selecionada.nome_evento || '—' }, { l: 'Tipo de Evento', v: selecionada.tipo_evento },
                      { l: 'Hóspedes', v: String(selecionada.hospedes) }, { l: 'Noites', v: String(noites(selecionada.data_inicio, selecionada.data_fim)) },
                      { l: 'Chegada', v: fmt(selecionada.data_inicio) }, { l: 'Saída', v: fmt(selecionada.data_fim) },
                      { l: 'Alimentação', v: selecionada.refeicoes ? 'Sim' : 'Não' },
                      { l: 'Valor Total', v: selecionada.valor_total ? `R$ ${Number(selecionada.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informado' },
                    ].map(({ l, v }) => (
                      <div key={l}>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: '#9CA3AF' }}>{l}</div>
                        <div className="text-sm" style={{ color: '#13293D' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {selecionada.mensagem && (
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#9CA3AF' }}>Mensagem do solicitante</div>
                      <p className="text-sm p-3 rounded-lg" style={{ background: '#F9FAFB', color: '#374151' }}>{selecionada.mensagem}</p>
                    </div>
                  )}
                  {selecionada.observacao_interna && (
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#9CA3AF' }}>Obs. Interna</div>
                      <p className="text-sm p-3 rounded-lg" style={{ background: '#FFFBEB', color: '#374151' }}>{selecionada.observacao_interna}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Aba Histórico */}
              {!editando && abaDetalhe === 'historico' && (
                <div>
                  {historico.length === 0 ? (
                    <div className="py-12 text-center">
                      <History size={36} className="mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                      <p className="text-sm" style={{ color: '#9CA3AF' }}>Nenhuma alteração registrada ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historico.map(h => (
                        <div key={h.id} className="rounded-xl border p-4" style={{ borderColor: '#E5E7EB' }}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: '#EFF6FF', color: '#006494' }}>
                              {h.usuario}
                            </span>
                            <span className="text-xs" style={{ color: '#9CA3AF' }}>
                              {new Date(h.created_at).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {Object.entries(h.alteracoes).map(([campo, { antes, depois }]) => (
                              <div key={campo} className="text-xs rounded-lg p-2.5" style={{ background: '#F9FAFB' }}>
                                <span className="font-semibold" style={{ color: '#374151' }}>{campo}: </span>
                                <span className="line-through" style={{ color: '#EF4444' }}>{antes || '(vazio)'}</span>
                                <span style={{ color: '#9CA3AF' }}> → </span>
                                <span className="font-semibold" style={{ color: '#059669' }}>{depois || '(vazio)'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Aba Quartos */}
              {!editando && abaDetalhe === 'quartos' && (
                <div className="space-y-4">
                  {/* Link público */}
                  {selecionada.status === 'confirmada' && (
                    <div className="rounded-xl p-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#059669' }}>
                          <Link2 size={15} /> Link para o responsável preencher os quartos
                        </div>
                        <button onClick={copiarLink}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                          style={{ background: linkCopiado ? '#059669' : '#ECFDF5', color: linkCopiado ? 'white' : '#059669' }}>
                          <Copy size={12} /> {linkCopiado ? 'Copiado!' : 'Copiar link'}
                        </button>
                      </div>
                      <p className="text-xs truncate font-mono p-2 rounded-lg" style={{ background: 'white', color: '#374151' }}>
                        {getLinkPublico(selecionada.token)}
                      </p>
                    </div>
                  )}
                  {selecionada.status !== 'confirmada' && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}>
                      ⚠️ O link público só é gerado após a reserva ser <strong>confirmada</strong>.
                    </div>
                  )}

                  {/* Seleção de quartos */}
                  <div>
                    <p className="text-xs font-semibold mb-3" style={{ color: '#374151' }}>
                      Selecione os quartos desta reserva e cadastre os hóspedes:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {quartosList.map(q => {
                        const rq = reservaQuartos.find(x => x.quarto_id === q.id)
                        const ativo = !!rq
                        return (
                          <button key={q.id} type="button" onClick={() => toggleQuartoReserva(q.id)}
                            className="text-left px-3 py-2.5 rounded-xl border-2 text-xs transition-all"
                            style={{ borderColor: ativo ? '#006494' : '#E5E7EB', background: ativo ? '#E8F4F8' : 'white', color: ativo ? '#006494' : '#374151' }}>
                            <div className="font-bold">{q.nome}</div>
                            <div className="opacity-60 text-[10px]">{q.climatizacao === 'ar_condicionado' ? 'A/C' : 'Vent.'} · {q.capacidade} leitos · {rq ? `${rq.hospedes.length} cadastrados` : 'não selecionado'}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Hóspedes por quarto */}
                  {reservaQuartos.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold" style={{ color: '#374151' }}>Nomes dos hóspedes por quarto:</p>
                        <button onClick={() => imprimirQuartos()}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ background: '#13293D', color: 'white' }}>
                          🖨️ Imprimir / PDF — Todos
                        </button>
                      </div>
                      {reservaQuartos.map(rq => {
                        const q = quartosList.find(x => x.id === rq.quarto_id)
                        if (!q) return null
                        return (
                          <div key={rq.id} className="rounded-xl border p-3" style={{ borderColor: '#E5E7EB' }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold" style={{ color: '#13293D' }}>{q.nome}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs" style={{ color: '#9CA3AF' }}>{rq.hospedes.length}/{q.capacidade} leitos</span>
                                <button onClick={() => imprimirQuartos(q.id)}
                                  className="text-xs px-2 py-1 rounded-lg font-semibold hover:opacity-80"
                                  style={{ background: '#F3F4F6', color: '#374151' }}>🖨️</button>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              {rq.hospedes.map((nome, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <input type="text" value={nome}
                                    onChange={e => {
                                      const updated = [...rq.hospedes]; updated[i] = e.target.value
                                      atualizarHospedesQuarto(rq.id, updated)
                                    }}
                                    className="flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}
                                    placeholder={`Hóspede ${i + 1}`} />
                                  <button onClick={() => atualizarHospedesQuarto(rq.id, rq.hospedes.filter((_, j) => j !== i))}
                                    className="p-1 rounded hover:bg-red-50"><Trash2 size={13} style={{ color: '#EF4444' }} /></button>
                                </div>
                              ))}
                              {rq.hospedes.length < q.capacidade && (
                                <button onClick={() => atualizarHospedesQuarto(rq.id, [...rq.hospedes, ''])}
                                  className="flex items-center gap-1 text-xs font-semibold mt-1" style={{ color: '#006494' }}>
                                  <UserPlus size={13} /> Adicionar hóspede
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Formulário de edição */}
              {editando && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { l: 'Nome completo', f: 'nome' }, { l: 'Igreja / Org.', f: 'igreja' },
                      { l: 'E-mail', f: 'email' }, { l: 'Telefone', f: 'telefone' },
                      { l: 'Nome do Evento', f: 'nome_evento' },
                    ].map(({ l, f }) => (
                      <div key={f}>
                        <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>{l}</label>
                        <input type="text" value={(editForm[f as keyof Reserva] as string) ?? ''}
                          onChange={e => setEditForm(p => ({ ...p, [f]: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Tipo de Evento</label>
                      <select value={editForm.tipo_evento ?? ''} onChange={e => setEditForm(p => ({ ...p, tipo_evento: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                        {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Chegada</label>
                      <input type="date" value={editForm.data_inicio ?? ''}
                        onChange={e => setEditForm(p => ({ ...p, data_inicio: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Saída</label>
                      <input type="date" value={editForm.data_fim ?? ''}
                        onChange={e => setEditForm(p => ({ ...p, data_fim: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Hóspedes</label>
                      <input type="number" min="1" value={editForm.hospedes ?? ''}
                        onChange={e => setEditForm(p => ({ ...p, hospedes: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Status</label>
                      <select value={editForm.status ?? ''} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                        {Object.entries(statusCfg).map(([k, { label }]) => <option key={k} value={k}>{label}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Cálculo de valor */}
                  <div className="rounded-xl p-4" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                    <div className="text-xs font-bold mb-3" style={{ color: '#0369A1' }}>Calcular Valor Automaticamente</div>
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Tipo de Diária</label>
                        <select value={editTipoDiaria} onChange={e => setEditTipoDiaria(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#BAE6FD', color: '#374151' }}>
                          {tiposDiaria.map(t => <option key={t.key} value={t.key}>{t.label} — R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{t.porPessoa ? '/pess./noite' : ' fixo'}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Crianças isentas (até 7 anos)</label>
                        <input type="number" min="0" value={editCriancas} onChange={e => setEditCriancas(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#BAE6FD', color: '#374151' }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs" style={{ color: '#0369A1' }}>
                        {editForm.data_inicio && editForm.data_fim && editForm.hospedes
                          ? `${noites(editForm.data_inicio, editForm.data_fim)} noite(s) · ${Math.max(0, Number(editForm.hospedes) - (parseInt(editCriancas) || 0))} pagantes`
                          : 'Preencha datas e hóspedes'}
                      </div>
                      <button onClick={() => {
                        const v = calcularValorEdicao()
                        if (v > 0) setEditForm(p => ({ ...p, valor_total: v, tipo_diaria: editTipoDiaria, criancas_isentas: parseInt(editCriancas) || 0 }))
                      }} className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#006494' }}>
                        Calcular e Aplicar
                      </button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Valor Total (R$)</label>
                      <input type="number" step="0.01" value={editForm.valor_total ?? ''}
                        onChange={e => setEditForm(p => ({ ...p, valor_total: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Alimentação inclusa</label>
                      <select value={editForm.refeicoes ? 'true' : 'false'} onChange={e => setEditForm(p => ({ ...p, refeicoes: e.target.value === 'true' }))}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>Observação Interna</label>
                    <textarea rows={3} value={editForm.observacao_interna ?? ''}
                      onChange={e => setEditForm(p => ({ ...p, observacao_interna: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#E5E7EB', color: '#374151' }} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setEditando(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50"
                      style={{ borderColor: '#E5E7EB', color: '#374151' }}>Cancelar</button>
                    <button onClick={salvarEdicao} disabled={salvando}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: '#006494' }}>
                      {salvando ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={15} /> Salvar Alterações</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal configurar proposta */}
      {propostaModal && selecionada && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={e => { if (e.target === e.currentTarget) setPropostaModal(false) }}>
          <div className="bg-white rounded-2xl w-full max-w-md" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
              <h2 className="font-bold text-base flex items-center gap-2" style={{ color: '#13293D' }}>
                <FileText size={18} style={{ color: '#006494' }} /> Configurar Proposta
              </h2>
              <button onClick={() => setPropostaModal(false)} style={{ color: '#9CA3AF' }}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Selecione o tipo de diária para calcular o valor corretamente na proposta:
              </p>

              {/* Tipo diária com cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: '#374151' }}>Tipo de Diária (Tabela 2026)</label>
                {tiposDiaria.map(t => (
                  <button key={t.key} type="button" onClick={() => setPropostaTipoDiaria(t.key)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all"
                    style={{
                      borderColor: propostaTipoDiaria === t.key ? '#006494' : '#E5E7EB',
                      background: propostaTipoDiaria === t.key ? '#EFF6FF' : 'white',
                    }}>
                    <span className="font-semibold text-left" style={{ color: propostaTipoDiaria === t.key ? '#006494' : '#374151' }}>{t.label}</span>
                    <span className="font-bold flex-shrink-0 ml-3" style={{ color: propostaTipoDiaria === t.key ? '#006494' : '#9CA3AF' }}>
                      R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{t.porPessoa ? '/pess./noite' : ' fixo'}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#374151' }}>Crianças até 7 anos (isentas)</label>
                <input type="number" min="0" value={propostaCriancas} onChange={e => setPropostaCriancas(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }} />
              </div>

              {/* Preview do valor */}
              {(() => {
                const td = tiposDiaria.find(t => t.key === propostaTipoDiaria)
                const nts = noites(selecionada.data_inicio, selecionada.data_fim)
                const criancas = parseInt(propostaCriancas) || 0
                const pagantes = Math.max(0, selecionada.hospedes - criancas)
                const base = td ? (td.porPessoa ? td.valor * pagantes * nts : td.valor) : 0
                const alim = selecionada.refeicoes ? PRECO_REFEICAO * pagantes * 3 * diasEntre(selecionada.data_inicio, selecionada.data_fim).length : 0
                const total = base + alim
                return (
                  <div className="rounded-xl p-4" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#0369A1' }}>
                      Prévia do valor calculado
                    </div>
                    <div className="text-2xl font-black" style={{ color: '#006494' }}>
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      {pagantes} pagantes · {nts} noite(s){selecionada.refeicoes ? ' · alimentação inclusa' : ''}
                    </div>
                  </div>
                )
              })()}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setPropostaModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}>Cancelar</button>
                <button onClick={gerarProposta}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ background: '#13293D' }}>
                  <FileText size={16} /> Gerar PDF
                </button>
              </div>
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
