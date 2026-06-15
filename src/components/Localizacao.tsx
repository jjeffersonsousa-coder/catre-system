'use client'
import { MapPin, Navigation, Share2, Phone, Mail } from 'lucide-react'

export default function Localizacao() {
  const mapsUrl = 'https://share.google/MfOE0mo71Qecuv8Ah'

  return (
    <section id="localizacao" className="py-20 px-4" style={{ background: '#E8F4F8' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#006494' }}>
            Como Chegar
          </div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#13293D' }}>
            Localização
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map embed placeholder */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ height: 380, boxShadow: '0 4px 24px rgba(19,41,61,0.12)' }}
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
          <div className="space-y-6">
            {/* Address card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(19,41,61,0.08)' }}
            >
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#E8F4F8' }}
                >
                  <MapPin size={20} style={{ color: '#006494' }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: '#13293D' }}>Endereço</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    CATRE Penedo<br />
                    Penedo — Alagoas, Brasil<br />
                    CEP: 57200-000
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(19,41,61,0.08)' }}
            >
              <h3 className="font-bold mb-4" style={{ color: '#13293D' }}>Contato</h3>
              <div className="space-y-3">
                <a
                  href="tel:+558200000000"
                  className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: '#006494' }}
                >
                  <Phone size={16} />
                  (82) 0000-0000
                </a>
                <a
                  href="mailto:catre@adventistars.org.br"
                  className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: '#006494' }}
                >
                  <Mail size={16} />
                  catre@adventistars.org.br
                </a>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: '#006494' }}
              >
                <Navigation size={16} />
                Abrir no Google Maps
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'CATRE Penedo', url: mapsUrl })
                  } else {
                    navigator.clipboard.writeText(mapsUrl)
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border-2"
                style={{ borderColor: '#006494', color: '#006494' }}
              >
                <Share2 size={16} />
                Compartilhar
              </button>
            </div>

            {/* Como chegar */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#13293D', color: 'white' }}
            >
              <h4 className="font-semibold mb-3 text-sm" style={{ color: '#A8DADC' }}>Como Chegar</h4>
              <ul className="text-xs space-y-1.5 opacity-80 leading-relaxed">
                <li>🚗 De Maceió: BR-316 em direção a Penedo (~120km, 1h45)</li>
                <li>🚌 Ônibus: Terminal Rodoviário de Penedo</li>
                <li>✈️ Aeroporto mais próximo: Maceió (HZ, Zumbi dos Palmares)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
