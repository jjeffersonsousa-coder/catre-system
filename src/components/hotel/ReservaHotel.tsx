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

export default function ReservaHotel() {
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', igreja: '',
    tipoEvento: '', dataInicio: '', dataFim: '',
    hospedes: '', refeicoes: false, mensagem: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setEnviado(true)
  }

  return (
    <section id="reserva" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left promo */}
          <div className="lg:col-span-2">
            <div
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{ color: '#006494', background: '#E8F4F8' }}
            >
              Reserve agora
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: '#13293D' }}>
              Seu próximo evento começa aqui
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#6B7280' }}>
              Preencha o formulário e nossa equipe entrará em contato em até 24 horas para confirmar
              a disponibilidade e apresentar as melhores opções para o seu grupo.
            </p>

            <div className="space-y-4">
              {[
                { icon: Calendar, text: 'Confirmação em até 24h úteis' },
                { icon: Users, text: 'Capacidade para até 400 pessoas' },
                { icon: Mail, text: 'Orçamento personalizado gratuito' },
                { icon: Phone, text: 'Suporte pelo WhatsApp' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#E8F4F8' }}
                  >
                    <Icon size={16} style={{ color: '#006494' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#374151' }}>{text}</span>
                </div>
              ))}
            </div>

            <div
              className="mt-8 p-5 rounded-2xl"
              style={{ background: '#13293D', color: 'white' }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: '#A8DADC' }}>Telefone / WhatsApp</p>
              <a href="tel:+552435511223" className="text-xl font-bold text-white hover:opacity-80">
                (24) 3551-1223
              </a>
              <p className="text-xs mt-2 opacity-60">Seg–Sex: 8h–17h | Sáb: 8h–12h</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {enviado ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ background: '#F8FAFC', border: '2px solid #E8F4F8' }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: '#F0FDF4' }}
                >
                  <CheckCircle size={40} style={{ color: '#22C55E' }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#13293D' }}>
                  Solicitação Enviada!
                </h3>
                <p className="text-base mb-6" style={{ color: '#6B7280' }}>
                  Nossa equipe entrará em contato em até 24h para confirmar a disponibilidade.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: '#006494' }}
                >
                  Nova Solicitação
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 space-y-5"
                style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Nome completo *</label>
                    <input required type="text" value={form.nome} onChange={e => set('nome', e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none focus:border-blue-400 transition-colors"
                      style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Igreja / Organização *</label>
                    <input required type="text" value={form.igreja} onChange={e => set('igreja', e.target.value)}
                      placeholder="Nome da igreja"
                      className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none focus:border-blue-400 transition-colors"
                      style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>E-mail *</label>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none focus:border-blue-400 transition-colors"
                      style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Telefone / WhatsApp *</label>
                    <input required type="tel" value={form.telefone} onChange={e => set('telefone', e.target.value)}
                      placeholder="(00) 99999-9999"
                      className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none focus:border-blue-400 transition-colors"
                      style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Tipo de evento *</label>
                  <select required value={form.tipoEvento} onChange={e => set('tipoEvento', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none"
                    style={{ borderColor: '#E5E7EB', color: '#13293D' }}>
                    <option value="">Selecione o tipo...</option>
                    {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Chegada *</label>
                    <input required type="date" value={form.dataInicio} onChange={e => set('dataInicio', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none"
                      style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Saída *</label>
                    <input required type="date" value={form.dataFim} onChange={e => set('dataFim', e.target.value)}
                      min={form.dataInicio || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none"
                      style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Hóspedes *</label>
                    <input required type="number" min="1" value={form.hospedes} onChange={e => set('hospedes', e.target.value)}
                      placeholder="Ex: 50"
                      className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none"
                      style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="refeicoes2" checked={form.refeicoes}
                    onChange={e => set('refeicoes', e.target.checked)}
                    className="w-4 h-4 rounded" style={{ accentColor: '#006494' }} />
                  <label htmlFor="refeicoes2" className="text-sm" style={{ color: '#374151' }}>
                    Incluir serviço de alimentação
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Observações</label>
                  <textarea rows={3} value={form.mensagem} onChange={e => set('mensagem', e.target.value)}
                    placeholder="Necessidades especiais, equipamentos, detalhes adicionais..."
                    className="w-full px-4 py-3 rounded-xl bg-white border text-sm outline-none resize-none"
                    style={{ borderColor: '#E5E7EB', color: '#13293D' }} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: '#006494' }}
                >
                  {loading
                    ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Enviar Solicitação de Reserva'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
