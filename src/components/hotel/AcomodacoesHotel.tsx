import { Users, BedDouble, Home, Building2 } from 'lucide-react'

const acomodacoes = [
  {
    icon: BedDouble,
    nome: 'Dormitórios Coletivos',
    desc: 'Quartos compartilhados com beliches, armários individuais e banheiros privativos por ala. Ideal para grupos jovens e acampamentos.',
    capacidade: '8–16 pessoas por quarto',
    destaque: 'Mais reservado',
    cor: '#006494',
  },
  {
    icon: Home,
    nome: 'Chalés Familiares',
    desc: 'Chalés independentes com camas de casal, beliches para crianças, varanda e contato direto com a natureza.',
    capacidade: '4–6 pessoas por chalé',
    destaque: null,
    cor: '#4D9FBF',
  },
  {
    icon: Building2,
    nome: 'Suítes Executivas',
    desc: 'Acomodação privativa para líderes e palestrantes com maior conforto, banheiro privativo e TV.',
    capacidade: '2 pessoas por suíte',
    destaque: null,
    cor: '#13293D',
  },
  {
    icon: Users,
    nome: 'Alojamento Geral',
    desc: 'Grande pavilhão de hospedagem para grupos numerosos com colchões, tendas internas e banheiros coletivos.',
    capacidade: 'Até 200 pessoas',
    destaque: null,
    cor: '#A8DADC',
  },
]

export default function AcomodacoesHotel() {
  return (
    <section id="acomodacoes" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#006494', background: '#E8F4F8' }}
          >
            Acomodações
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#13293D' }}>
            Hospedagem para todos os perfis
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#6B7280' }}>
            Diferentes opções de acomodação para atender grupos de todos os tamanhos e orçamentos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {acomodacoes.map(({ icon: Icon, nome, desc, capacidade, destaque, cor }) => (
            <div
              key={nome}
              className="rounded-2xl overflow-hidden border flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ borderColor: '#E5E7EB' }}
            >
              {/* Color band */}
              <div
                className="h-2"
                style={{ background: cor }}
              />

              <div className="p-6 flex flex-col flex-1">
                {destaque && (
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 w-fit"
                    style={{ background: '#E8F4F8', color: '#006494' }}
                  >
                    {destaque}
                  </span>
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#F8FAFC' }}
                >
                  <Icon size={24} style={{ color: cor }} />
                </div>

                <h3 className="font-bold text-base mb-3" style={{ color: '#13293D' }}>{nome}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#6B7280' }}>{desc}</p>

                <div
                  className="mt-5 pt-4 border-t text-xs font-semibold flex items-center gap-1.5"
                  style={{ borderColor: '#F3F4F6', color: '#374151' }}
                >
                  <Users size={13} style={{ color: '#006494' }} />
                  {capacidade}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#reserva"
            className="inline-block px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: '#006494' }}
          >
            Consultar Disponibilidade
          </a>
        </div>
      </div>
    </section>
  )
}
