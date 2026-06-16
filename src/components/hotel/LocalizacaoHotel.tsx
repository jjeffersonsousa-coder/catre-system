'use client'
import { MapPin, Navigation, Phone, Mail, Plane, Car } from 'lucide-react'

const mapsUrl = 'https://share.google/MfOE0mo71Qecuv8Ah'

const distancias = [
  { icon: Car, label: 'Rio de Janeiro', dist: '~165 km', tempo: '2h de carro' },
  { icon: Car, label: 'São Paulo', dist: '~330 km', tempo: '3h30 de carro' },
  { icon: Plane, label: 'Aeroporto Galeão (GIG)', dist: '~180 km', tempo: 'Via Dutra' },
  { icon: Plane, label: 'Santos Dumont (SDU)', dist: '~175 km', tempo: 'Via Dutra' },
]

export default function LocalizacaoHotel() {
  return (
    <section id="localizacao" className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#006494', background: '#E8F4F8' }}
          >
            Localização
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#13293D' }}>
            Como chegar ao CATRE
          </h2>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Penedo, Itatiaia — RJ · Próximo ao Parque Nacional do Itatiaia
          </p>
        </div>

        {/* Distance chips */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {distancias.map(({ icon: Icon, label, dist, tempo }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border"
              style={{ borderColor: '#E5E7EB' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#E8F4F8' }}
              >
                <Icon size={18} style={{ color: '#006494' }} />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: '#13293D' }}>{label}</div>
                <div className="text-xs" style={{ color: '#006494' }}>{dist}</div>
                <div className="text-xs" style={{ color: '#9CA3AF' }}>{tempo}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ height: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <iframe
              title="Localização CATRE Penedo"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d582.4507878677503!2d-44.51668389252121!3d-22.44159891471872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9e799c8d2a5413%3A0x1824c94b20ae7ec2!2sCentro%20de%20Treinamento%20e%20Recrea%C3%A7%C3%A3o%20Adventista%20-%20ARS%20-%20Satulinna!5e0!3m2!1spt-BR!2sbr!4v1781533667553!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#006494' }} />
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: '#13293D' }}>Endereço</h4>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                    Av. Casa das Pedras, 646<br />
                    Jardim Martineli — Itatiaia, RJ<br />
                    CEP: 27580-000
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#E5E7EB' }}>
              <h4 className="font-bold text-sm mb-3" style={{ color: '#13293D' }}>Contato</h4>
              <div className="space-y-2">
                <a href="tel:+552435511223" className="flex items-center gap-2 text-xs hover:opacity-70" style={{ color: '#006494' }}>
                  <Phone size={14} /> (24) 3551-1223
                </a>
                <a href="mailto:tesouraria.ars@adventistas.org" className="flex items-center gap-2 text-xs hover:opacity-70" style={{ color: '#006494' }}>
                  <Mail size={14} /> tesouraria.ars@adventistas.org
                </a>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: '#E5E7EB' }}>
              <h4 className="font-bold text-sm mb-2" style={{ color: '#13293D' }}>Via Presidente Dutra (BR-116)</h4>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                Acesso principal pela Via Dutra, saída Itatiaia. Sinalização para Penedo após a saída.
                Estacionamento gratuito no local.
              </p>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: '#006494' }}
            >
              <Navigation size={16} />
              Abrir no Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
