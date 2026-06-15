const estrutura = [
  {
    categoria: 'Hospedagem',
    icon: '🛏️',
    itens: [
      { nome: 'Quartos Coletivos', desc: 'Acomodações para grupos com beliches e armários' },
      { nome: 'Quartos Familiares', desc: 'Quartos com camas de casal e estrutura familiar' },
      { nome: 'Banheiros', desc: 'Banheiros coletivos e privativos' },
      { nome: 'Roupa de Cama', desc: 'Disponível mediante solicitação prévia' },
    ],
  },
  {
    categoria: 'Alimentação',
    icon: '🍽️',
    itens: [
      { nome: 'Restaurante', desc: 'Serviço de alimentação completo para grupos' },
      { nome: 'Refeitório', desc: 'Espaço amplo para refeições coletivas' },
      { nome: 'Cardápios Planejados', desc: 'Cardápios personalizados para eventos' },
      { nome: 'Atendimento para Grupos', desc: 'Estrutura para grandes grupos e convenções' },
    ],
  },
  {
    categoria: 'Eventos',
    icon: '🎤',
    itens: [
      { nome: 'Auditórios', desc: 'Espaços para palestras e cultos com capacidade variada' },
      { nome: 'Salas de Reunião', desc: 'Salas menores para workshops e treinamentos' },
      { nome: 'Capela', desc: 'Espaço sagrado para momentos de espiritualidade' },
      { nome: 'Espaços de Treinamento', desc: 'Ambientes equipados para capacitações' },
    ],
  },
  {
    categoria: 'Lazer',
    icon: '⚽',
    itens: [
      { nome: 'Piscina', desc: 'Piscina para recreação com área de lazer' },
      { nome: 'Campo de Futebol', desc: 'Campo gramado para esportes coletivos' },
      { nome: 'Quadra Poliesportiva', desc: 'Quadra para vôlei, basquete e futsal' },
      { nome: 'Salão de Jogos', desc: 'Ping-pong, sinuca, pebolim e mais' },
    ],
  },
  {
    categoria: 'Segurança',
    icon: '🔒',
    itens: [
      { nome: 'Controle de Acesso', desc: 'Portaria com registro de entrada e saída' },
      { nome: 'Cadastro de Veículos', desc: 'Controle de veículos no estacionamento' },
      { nome: 'Check-in Digital', desc: 'Sistema digital de registro de hóspedes' },
      { nome: 'Gestão de Hospedagem', desc: 'Controle integrado de ocupação' },
    ],
  },
]

export default function Estrutura() {
  return (
    <section id="estrutura" className="py-20 px-4" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#006494' }}>
            O que oferecemos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#13293D' }}>
            Estrutura Completa para seu Evento
          </h2>
          <p className="mt-4 text-base max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
            Do conforto da hospedagem à infraestrutura para grandes eventos, o CATRE oferece
            tudo que seu grupo precisa em um único lugar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estrutura.map((cat) => (
            <div
              key={cat.categoria}
              className="rounded-2xl p-6 border transition-transform hover:-translate-y-1"
              style={{
                borderColor: '#E8F4F8',
                background: '#F5F7FA',
                boxShadow: '0 2px 12px rgba(19,41,61,0.06)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="text-lg font-bold" style={{ color: '#13293D' }}>
                  {cat.categoria}
                </h3>
              </div>
              <ul className="space-y-3">
                {cat.itens.map((item) => (
                  <li key={item.nome} className="flex gap-3">
                    <span
                      className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: '#006494' }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: '#13293D' }}>{item.nome}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
