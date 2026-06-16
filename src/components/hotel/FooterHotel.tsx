import Link from 'next/link'
import { Phone, Mail, MapPin, Share2, MessageSquareShare, Globe } from 'lucide-react'

const links = {
  Site: [
    { href: '#sobre', label: 'Sobre o CATRE' },
    { href: '#estrutura', label: 'Estrutura' },
    { href: '#acomodacoes', label: 'Acomodações' },
    { href: '#galeria', label: 'Galeria' },
    { href: '#reserva', label: 'Reservas' },
  ],
  Informações: [
    { href: '#faq', label: 'Perguntas Frequentes' },
    { href: '#localizacao', label: 'Como Chegar' },
    { href: '/admin', label: 'Área Administrativa' },
  ],
}

export default function FooterHotel() {
  return (
    <footer style={{ background: '#0d1f2d', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ background: '#006494' }}
              >
                ARS
              </div>
              <div>
                <div className="font-bold text-white">CATRE Penedo</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Associação Rio Sul · IASD</div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Centro Adventista de Treinamento — localizado em Penedo, Itatiaia/RJ.
              Mais de 30 anos promovendo crescimento espiritual e capacitação.
            </p>

            <div className="space-y-2.5">
              <a href="tel:+552435511223" className="flex items-center gap-2.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <Phone size={15} style={{ color: '#4D9FBF' }} />
                (24) 3551-1223
              </a>
              <a href="mailto:catre@adventistars.org.br" className="flex items-center gap-2.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <Mail size={15} style={{ color: '#4D9FBF' }} />
                catre@adventistars.org.br
              </a>
              <div className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <MapPin size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#4D9FBF' }} />
                Av. Casa das Pedras, 646 — Penedo, Itatiaia/RJ
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Share2, href: '#' },
                { Icon: MessageSquareShare, href: '#' },
                { Icon: Globe, href: 'https://adventistars.org.br' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <Icon size={17} style={{ color: 'rgba(255,255,255,0.65)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-bold text-sm mb-5 text-white">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} CATRE Penedo — Associação Rio Sul da Igreja Adventista do Sétimo Dia.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Desenvolvido pela equipe de TI da ARS
          </p>
        </div>
      </div>
    </footer>
  )
}
