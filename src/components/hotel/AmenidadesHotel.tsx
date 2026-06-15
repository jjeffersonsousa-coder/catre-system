import {
  Wifi, Utensils, Waves, Dumbbell, TreePine, Music,
  Mic2, BookOpen, Car, Moon, Coffee, Users
} from 'lucide-react'

const amenidades = [
  { icon: Utensils, label: 'Refeitório' },
  { icon: Waves, label: 'Piscina' },
  { icon: TreePine, label: 'Área Verde' },
  { icon: Wifi, label: 'Wi-Fi' },
  { icon: Mic2, label: 'Auditório' },
  { icon: Music, label: 'Sonorização' },
  { icon: Dumbbell, label: 'Quadra Esportiva' },
  { icon: BookOpen, label: 'Sala de Estudo' },
  { icon: Car, label: 'Estacionamento' },
  { icon: Moon, label: 'Dormitórios' },
  { icon: Coffee, label: 'Lanchonete' },
  { icon: Users, label: 'Salas de Reunião' },
]

export default function AmenidadesHotel() {
  return (
    <section id="estrutura" className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#006494', background: '#E8F4F8' }}
          >
            Infraestrutura
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#13293D' }}>
            Tudo que você precisa
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#6B7280' }}>
            Estrutura completa para que seu evento ou retiro seja inesquecível.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {amenidades.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default"
              style={{ borderColor: '#E5E7EB' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: '#E8F4F8' }}
              >
                <Icon size={22} style={{ color: '#006494' }} />
              </div>
              <span className="text-xs font-semibold text-center" style={{ color: '#374151' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
