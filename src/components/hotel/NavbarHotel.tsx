'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#estrutura', label: 'Estrutura' },
  { href: '#acomodacoes', label: 'Acomodações' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#localizacao', label: 'Localização' },
  { href: '#faq', label: 'FAQ' },
]

export default function NavbarHotel() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: '#006494' }}
          >
            ARS
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-sm leading-tight" style={{ color: scrolled ? '#13293D' : 'white' }}>
              CATRE Penedo
            </div>
            <div className="text-xs leading-tight" style={{ color: scrolled ? '#6B7280' : 'rgba(255,255,255,0.7)' }}>
              Associação Rio Sul
            </div>
          </div>
        </Link>

        {/* Nav links desktop */}
        <nav className="hidden lg:flex items-center gap-6 flex-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: scrolled ? '#374151' : 'rgba(255,255,255,0.9)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Phone */}
          <a
            href="tel:+552435511223"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: scrolled ? '#006494' : 'rgba(255,255,255,0.85)' }}
          >
            <Phone size={14} />
            (24) 3551-1223
          </a>

          {/* CTA */}
          <a
            href="#reserva"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: '#006494' }}
          >
            Reservar
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: scrolled ? '#13293D' : 'white' }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t" style={{ borderColor: '#F3F4F6' }}>
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                style={{ color: '#374151' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
