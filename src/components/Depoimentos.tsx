'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const depoimentos = [
  {
    nome: 'Pastor João Silva',
    cargo: 'Pastor Distrital — Alagoas',
    texto: 'O CATRE tem sido um espaço fundamental para nossos retiros de jovens. A estrutura é excelente e a equipe sempre muito prestativa. Realizamos nosso acampamento anual há 5 anos consecutivos aqui.',
    stars: 5,
  },
  {
    nome: 'Drª Maria Santos',
    cargo: 'Coordenadora de Eventos — ARS',
    texto: 'Realizamos nossas convenções de líderes no CATRE e sempre tivemos uma experiência muito positiva. Os auditórios são bem equipados e o espaço oferece tudo que precisamos para um evento de qualidade.',
    stars: 5,
  },
  {
    nome: 'Elder Carlos Mendes',
    cargo: 'Líder de Jovens — Igreja Central Penedo',
    texto: 'Ambiente tranquilo, seguro e com infraestrutura completa. Nossa turma de jovens adorou as atividades na piscina e no campo de futebol. Com certeza voltaremos no próximo ano!',
    stars: 5,
  },
  {
    nome: 'Irma Tereza Costa',
    cargo: 'Coordenadora do Ministério da Mulher',
    texto: 'Realizamos nosso retiro feminino anual no CATRE e foi uma experiência maravilhosa. O espaço da capela é muito bonito e propício para momentos de espiritualidade. Recomendo para todos os grupos.',
    stars: 5,
  },
]

export default function Depoimentos() {
  const [idx, setIdx] = useState(0)

  const prev = () => setIdx(i => (i > 0 ? i - 1 : depoimentos.length - 1))
  const next = () => setIdx(i => (i < depoimentos.length - 1 ? i + 1 : 0))

  const dep = depoimentos[idx]

  return (
    <section className="py-20 px-4" style={{ background: '#13293D' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#A8DADC' }}>
          Depoimentos
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          O que dizem sobre o CATRE
        </h2>

        <div
          className="relative rounded-2xl p-8 md:p-12"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: dep.stars }).map((_, i) => (
              <Star key={i} size={18} fill="#F59E0B" stroke="none" />
            ))}
          </div>

          {/* Quote */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed italic mb-8">
            &ldquo;{dep.texto}&rdquo;
          </p>

          {/* Author */}
          <div>
            <div className="font-bold text-white">{dep.nome}</div>
            <div className="text-sm mt-1" style={{ color: '#A8DADC' }}>{dep.cargo}</div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {depoimentos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ background: i === idx ? '#A8DADC' : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
