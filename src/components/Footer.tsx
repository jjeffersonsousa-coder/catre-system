import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#13293D' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ background: '#006494' }}
              >
                C
              </div>
              <div className="text-white">
                <div className="font-bold">CATRE</div>
                <div className="text-xs opacity-50">Penedo</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Centro Adventista de Treinamento, Retiros e Eventos da Associação Rio Sul.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Navegação</h4>
            <ul className="space-y-2">
              {[
                { href: '#sobre', label: 'Sobre' },
                { href: '#estrutura', label: 'Estrutura' },
                { href: '#galeria', label: 'Galeria' },
                { href: '#faq', label: 'FAQ' },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Administrativo</h4>
            <ul className="space-y-2">
              {[
                { href: '/admin', label: 'Painel Admin' },
                { href: '/admin/manutencao', label: 'Manutenção' },
                { href: '/admin/reservas', label: 'Reservas' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contato</h4>
            <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <li>📍 Penedo, Alagoas</li>
              <li>📞 (82) 0000-0000</li>
              <li>✉️ catre@adventistars.org.br</li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} CATRE Penedo — Associação Rio Sul | Igreja Adventista do Sétimo Dia
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Sistema desenvolvido para a ARS
          </p>
        </div>
      </div>
    </footer>
  )
}
