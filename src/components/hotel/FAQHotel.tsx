'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const categorias = [
  {
    label: 'Reservas',
    faqs: [
      {
        q: 'Como faço para reservar o CATRE para meu evento?',
        a: 'Preencha o formulário de reserva nesta página ou entre em contato pelo telefone (24) 3551-1223. Nossa equipe responderá em até 24 horas úteis com informações de disponibilidade e orçamento.',
      },
      {
        q: 'Qual é a antecedência mínima para reservar?',
        a: 'Recomendamos fazer a reserva com pelo menos 30 dias de antecedência para datas de alta demanda (feriados, julho e dezembro). Para outros períodos, 15 dias geralmente é suficiente.',
      },
      {
        q: 'Como é feito o pagamento?',
        a: 'Aceitamos transferência bancária, PIX e boleto. Geralmente solicitamos um sinal de 30% para confirmação da reserva e o restante até 5 dias antes do evento.',
      },
    ],
  },
  {
    label: 'Estrutura',
    faqs: [
      {
        q: 'Qual é a capacidade máxima do CATRE?',
        a: 'O CATRE pode acomodar grupos de até 400 pessoas em hospedagem. O auditório principal tem capacidade para 300 pessoas sentadas. Temos ainda salas menores para grupos de 30 a 100 pessoas.',
      },
      {
        q: 'Há serviço de alimentação?',
        a: 'Sim. Oferecemos serviço de refeições (café da manhã, almoço, jantar e lanches) preparadas por nossa equipe. A alimentação segue princípios adventistas, com opções vegetarianas.',
      },
      {
        q: 'O Wi-Fi está disponível em todo o espaço?',
        a: 'O Wi-Fi está disponível no auditório, salas de reunião e refeitório. Nos dormitórios e áreas externas a cobertura pode variar.',
      },
    ],
  },
  {
    label: 'Localização',
    faqs: [
      {
        q: 'Como chegar ao CATRE?',
        a: 'Localizamos em Av. Casa das Pedras, 646, Jardim Martineli, Itatiaia/RJ. O acesso principal é pela Via Presidente Dutra (BR-116), saída Itatiaia, com sinalização para Penedo.',
      },
      {
        q: 'Há estacionamento no local?',
        a: 'Sim, temos estacionamento gratuito com capacidade para vários veículos e ônibus de excursão.',
      },
    ],
  },
]

export default function FAQHotel() {
  const [aba, setAba] = useState(0)
  const [aberto, setAberto] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#006494', background: '#E8F4F8' }}
          >
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#13293D' }}>
            Perguntas Frequentes
          </h2>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-xl p-1 mb-8"
          style={{ background: '#F3F4F6' }}
        >
          {categorias.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => { setAba(i); setAberto(null) }}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: aba === i ? 'white' : 'transparent',
                color: aba === i ? '#13293D' : '#6B7280',
                boxShadow: aba === i ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {categorias[aba].faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden transition-all"
              style={{ borderColor: aberto === i ? '#A8DADC' : '#E5E7EB' }}
            >
              <button
                onClick={() => setAberto(aberto === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-sm pr-4" style={{ color: '#13293D' }}>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 transition-transform"
                  style={{
                    color: '#006494',
                    transform: aberto === i ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>
              {aberto === i && (
                <div
                  className="px-6 pb-5 text-sm leading-relaxed"
                  style={{ color: '#6B7280', borderTop: '1px solid #F3F4F6' }}
                >
                  <div className="pt-4">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm" style={{ color: '#9CA3AF' }}>
          Não encontrou o que procurava?{' '}
          <a href="tel:+552435511223" className="font-semibold hover:underline" style={{ color: '#006494' }}>
            Entre em contato
          </a>
        </p>
      </div>
    </section>
  )
}
