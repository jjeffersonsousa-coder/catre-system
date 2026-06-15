export default function SobreCatre() {
  return (
    <section id="sobre" className="py-20 px-4" style={{ background: '#E8F4F8' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#006494' }}>
              Sobre o CATRE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#13293D' }}>
              Um espaço para encontros que transformam
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#13293D', opacity: 0.8 }}>
              O CATRE Penedo é um espaço destinado à realização de retiros espirituais,
              treinamentos, encontros, convenções, acampamentos, eventos religiosos e
              hospedagem, oferecendo conforto, lazer e infraestrutura adequada para grupos
              de diversos portes.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#13293D', opacity: 0.7 }}>
              Localizado em Penedo, Alagoas, o CATRE é um patrimônio da Igreja Adventista
              do Sétimo Dia — Associação Rio Sul — dedicado a servir comunidades, igrejas
              e organizações que buscam um ambiente tranquilo, seguro e estruturado para
              seus eventos e retiros.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#estrutura"
                className="px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: '#006494' }}
              >
                Ver Estrutura Completa
              </a>
              <a
                href="#galeria"
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all border-2"
                style={{ borderColor: '#006494', color: '#006494' }}
              >
                Ver Galeria de Fotos
              </a>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🏠', title: 'Hospedagem', desc: 'Quartos coletivos e familiares com conforto' },
              { icon: '🍽️', title: 'Alimentação', desc: 'Restaurante com cardápios planejados' },
              { icon: '🎤', title: 'Eventos', desc: 'Auditórios, salas e capelã para todos os formatos' },
              { icon: '⚽', title: 'Lazer', desc: 'Piscina, campo, quadra e área de convivência' },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl transition-transform hover:-translate-y-1"
                style={{ background: 'white', boxShadow: '0 2px 12px rgba(19,41,61,0.08)' }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold mb-1" style={{ color: '#13293D' }}>{item.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
