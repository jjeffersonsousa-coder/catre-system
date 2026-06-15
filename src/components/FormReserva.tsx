'use client'
import { useState } from 'react'
import { Calendar, Users, Phone, Mail, CheckCircle } from 'lucide-react'

const tiposEvento = [
  'Retiro Espiritual',
  'Treinamento / Capacitação',
  'Convenção',
  'Acampamento de Jovens',
  'Evento Familiar',
  'Outro',
]

export default function FormReserva() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    igreja: '',
    tipoEvento: '',
    dataInicio: '',
    dataFim: '',
    hospedes: '',
    refeicoes: false,
    mensagem: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Em produção: salvar no Supabase e enviar e-mail
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setEnviado(true)
  }

  if (enviado) {
    return (
      <section id="reserva" className="py-20 px-4" style={{ background: '#F5F7FA' }}>
        <div className="max-w-xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#F0FDF4' }}
          >
            <CheckCircle size={40} style={{ color: '#22C55E' }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#13293D' }}>
            Solicitação Enviada!
          </h2>
          <p className="text-base mb-6" style={{ color: '#6B7280' }}>
            Recebemos sua solicitação de reserva. Nossa equipe entrará em contato em até
            24h para confirmar a disponibilidade e detalhes.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: '#006494' }}
          >
            Voltar ao início
          </a>
        </div>
      </section>
    )
  }

  return (
    <section id="reserva" className="py-20 px-4" style={{ background: '#F5F7FA' }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#006494' }}>
            Solicitar Reserva
          </div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#13293D' }}>
            Reserve seu Espaço
          </h2>
          <p className="mt-3 text-sm" style={{ color: '#6B7280' }}>
            Preencha o formulário e nossa equipe entrará em contato para confirmar a disponibilidade.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-6"
          style={{ background: 'white', boxShadow: '0 4px 24px rgba(19,41,61,0.08)' }}
        >
          {/* Dados do responsável */}
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#13293D' }}>
              <Users size={18} style={{ color: '#006494' }} />
              Dados do Responsável
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Nome completo *</label>
                <input required type="text" value={form.nome} onChange={e => set('nome', e.target.value)}
                  placeholder="Seu nome" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Igreja / Organização *</label>
                <input required type="text" value={form.igreja} onChange={e => set('igreja', e.target.value)}
                  placeholder="Nome da igreja ou organização" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>
                  <Mail size={12} className="inline mr-1" />E-mail *
                </label>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="seu@email.com" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>
                  <Phone size={12} className="inline mr-1" />Telefone / WhatsApp *
                </label>
                <input required type="tel" value={form.telefone} onChange={e => set('telefone', e.target.value)}
                  placeholder="(82) 99999-9999" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
            </div>
          </div>

          <hr style={{ borderColor: '#F3F4F6' }} />

          {/* Dados do evento */}
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#13293D' }}>
              <Calendar size={18} style={{ color: '#006494' }} />
              Dados do Evento
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Tipo de evento *</label>
                <select required value={form.tipoEvento} onChange={e => set('tipoEvento', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }}>
                  <option value="">Selecione o tipo...</option>
                  {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Data de chegada *</label>
                <input required type="date" value={form.dataInicio} onChange={e => set('dataInicio', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Data de saída *</label>
                <input required type="date" value={form.dataFim} onChange={e => set('dataFim', e.target.value)}
                  min={form.dataInicio || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Número de hóspedes *</label>
                <input required type="number" min="1" value={form.hospedes} onChange={e => set('hospedes', e.target.value)}
                  placeholder="Ex: 50" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" id="refeicoes" checked={form.refeicoes}
                  onChange={e => set('refeicoes', e.target.checked)}
                  className="w-4 h-4 rounded" style={{ accentColor: '#006494' }} />
                <label htmlFor="refeicoes" className="text-sm" style={{ color: '#374151' }}>
                  Incluir serviço de alimentação
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Observações adicionais</label>
            <textarea rows={3} value={form.mensagem} onChange={e => set('mensagem', e.target.value)}
              placeholder="Necessidades especiais, equipamentos, outros detalhes..."
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: '#006494' }}
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : 'Enviar Solicitação de Reserva'}
          </button>

          <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
            Ao enviar, nossa equipe entrará em contato em até 24 horas úteis.
          </p>
        </form>
      </div>
    </section>
  )
}
