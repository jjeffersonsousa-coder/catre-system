'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqData = [
  {
    pergunta: 'Qual o horário de check-in?',
    resposta: 'O check-in é realizado a partir das 14h. Para chegadas antecipadas, entre em contato com nossa equipe com antecedência para verificar disponibilidade.',
  },
  {
    pergunta: 'Qual o horário de check-out?',
    resposta: 'O check-out deve ser realizado até as 12h (meio-dia). A entrega das chaves e liberação dos quartos deve ser feita no máximo até esse horário.',
  },
  {
    pergunta: 'Crianças pagam?',
    resposta: 'Crianças até 5 anos não pagam. De 6 a 12 anos, pagam 50% do valor. Acima de 12 anos, pagam o valor integral. Os valores são definidos por evento/grupo.',
  },
  {
    pergunta: 'Posso levar roupa de cama?',
    resposta: 'Sim! Você pode trazer sua própria roupa de cama e toalhas. Também oferecemos esse serviço mediante solicitação prévia com custo adicional.',
  },
  {
    pergunta: 'Como funciona a alimentação?',
    resposta: 'O CATRE oferece serviço de alimentação (café da manhã, almoço e jantar) com cardápios planejados. O valor das refeições pode estar incluso no pacote ou ser contratado separadamente.',
  },
  {
    pergunta: 'Como faço uma reserva?',
    resposta: 'Você pode reservar através deste site clicando em "Reservar Agora", ou entrar em contato diretamente com a administração do CATRE. Reservas estão sujeitas à disponibilidade e confirmação de pagamento.',
  },
  {
    pergunta: 'Qual a capacidade máxima do CATRE?',
    resposta: 'O CATRE comporta grupos de diversos portes, com capacidade para mais de 300 pessoas em regime de hospedagem. Para eventos sem pernoite, a capacidade dos auditórios é maior.',
  },
  {
    pergunta: 'Há estacionamento disponível?',
    resposta: 'Sim, o CATRE possui estacionamento interno com controle de acesso. Os veículos devem ser cadastrados no momento do check-in.',
  },
  {
    pergunta: 'Posso realizar eventos não religiosos no CATRE?',
    resposta: 'O CATRE está aberto a diferentes tipos de eventos como treinamentos corporativos, convenções, workshops e retiros de diversas naturezas, desde que estejam alinhados com os valores da instituição.',
  },
]

export default function FAQ() {
  const [aberto, setAberto] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-4" style={{ background: 'white' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#006494' }}>
            Dúvidas Frequentes
          </div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#13293D' }}>
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden border transition-all"
              style={{
                borderColor: aberto === idx ? '#006494' : '#E8F4F8',
                boxShadow: aberto === idx ? '0 2px 16px rgba(0,100,148,0.1)' : '0 1px 4px rgba(19,41,61,0.06)',
              }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setAberto(aberto === idx ? null : idx)}
              >
                <span className="font-semibold text-sm pr-4" style={{ color: '#13293D' }}>
                  {item.pergunta}
                </span>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: '#006494',
                    transform: aberto === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              {aberto === idx && (
                <div className="px-6 pb-5" style={{ color: '#6B7280' }}>
                  <p className="text-sm leading-relaxed">{item.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
