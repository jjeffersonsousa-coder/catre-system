import { Award, Heart, TreePine, Shield } from 'lucide-react'

const destaques = [
  {
    icon: TreePine,
    title: 'Natureza preservada',
    desc: 'Localizado em Penedo, no sopé do Parque Nacional do Itatiaia.',
  },
  {
    icon: Heart,
    title: 'Missão adventista',
    desc: 'Centro de treinamento, retiros e eventos da Associação Rio Sul.',
  },
  {
    icon: Award,
    title: '30+ anos de história',
    desc: 'Tradição de excelência em acolhimento e eventos cristãos.',
  },
  {
    icon: Shield,
    title: 'Segurança e conforto',
    desc: 'Infraestrutura completa com equipe dedicada ao seu bem-estar.',
  },
]

export default function SobreHotel() {
  return (
    <section id="sobre" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{ color: '#006494', background: '#E8F4F8' }}
            >
              Sobre o CATRE
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
              style={{ color: '#13293D' }}
            >
              Um espaço criado para transformar vidas
            </h2>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: '#4B5563' }}>
              <p>
                O CATRE — Centro Adventista de Treinamento, Retiros e Eventos — é o principal centro de
                capacitação e eventos da Associação Rio Sul da Igreja Adventista do Sétimo Dia, localizado
                em Penedo, Itatiaia/RJ.
              </p>
              <p>
                Cercado pela exuberante natureza do Parque Nacional do Itatiaia, o CATRE oferece uma
                infraestrutura completa para retiros espirituais, treinamentos, convenções, acampamentos e
                eventos institucionais com capacidade para mais de 400 pessoas.
              </p>
              <p>
                Nossa missão é proporcionar um ambiente acolhedor, seguro e inspirador onde grupos possam
                vivenciar momentos de crescimento espiritual, aprendizado e comunhão.
              </p>
            </div>

            <a
              href="#reserva"
              className="inline-block mt-8 px-7 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: '#006494' }}
            >
              Faça sua Reserva
            </a>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {destaques.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-6 border transition-all hover:shadow-md"
                style={{ borderColor: '#E5E7EB', background: '#FAFAFA' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#E8F4F8' }}
                >
                  <Icon size={22} style={{ color: '#006494' }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#13293D' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
