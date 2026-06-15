import { Star } from 'lucide-react'

const depoimentos = [
  {
    nome: 'Pr. Ricardo Almeida',
    cargo: 'Pastor Distrital — Rio de Janeiro/RJ',
    texto: 'O CATRE é simplesmente o melhor espaço para retiros espirituais. A natureza, a infraestrutura e a equipe tornam cada evento especial. Já realizamos três convenções aqui e voltaremos sempre.',
    nota: 5,
  },
  {
    nome: 'Irmã Claudia Ferreira',
    cargo: 'Líder de Jovens — São Paulo/SP',
    texto: 'Realizamos nosso acampamento de jovens com 200 participantes e tudo foi impecável. Desde a alimentação até a sonorização do auditório, não faltou nada. Recomendo com o coração.',
    nota: 5,
  },
  {
    nome: 'Diácono Marcos Santos',
    cargo: 'Ministério de Educação — Niterói/RJ',
    texto: 'Ambiente acolhedor, equipe atenciosa e localização privilegiada. Os participantes do treinamento saíram transformados. O CATRE vai muito além de um simples centro de eventos.',
    nota: 5,
  },
]

export default function DepoimentosHotel() {
  return (
    <section className="py-20 px-4" style={{ background: '#13293D' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#A8DADC', background: 'rgba(168,218,220,0.15)' }}
          >
            Depoimentos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            O que dizem nossos visitantes
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)' }}>
            Experiências reais de quem viveu momentos especiais no CATRE.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {depoimentos.map(({ nome, cargo, texto, nota }) => (
            <div
              key={nome}
              className="rounded-2xl p-7 flex flex-col"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: nota }).map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                ))}
              </div>

              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
                &ldquo;{texto}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: '#006494' }}
                >
                  {nome.charAt(nome.lastIndexOf(' ') + 1)}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{nome}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{cargo}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
