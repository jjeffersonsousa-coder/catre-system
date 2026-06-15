'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#estrutura', label: 'Estrutura' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#faq', label: 'FAQ' },
  { href: '#localizacao', label: 'Localização' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? '#13293D' : 'rgba(19,41,61,0.7)',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: '#006494' }}
          >
            C
          </div>
          <div className="text-white">
            <div className="font-bold text-base leading-tight">CATRE</div>
            <div className="text-xs opacity-70 leading-tight">Penedo</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Admin
          </Link>
          <a
            href="#reserva"
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#006494' }}
          >
            Reservar Agora
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10" style={{ background: '#13293D' }}>
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/80 hover:text-white text-sm font-medium py-1"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <hr className="border-white/10 my-1" />
            <Link href="/admin" className="text-white/60 text-sm py-1" onClick={() => setOpen(false)}>
              Área Administrativa
            </Link>
            <a
              href="#reserva"
              className="px-4 py-2 rounded-lg text-white text-sm font-semibold text-center"
              style={{ background: '#006494' }}
              onClick={() => setOpen(false)}
            >
              Reservar Agora
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
