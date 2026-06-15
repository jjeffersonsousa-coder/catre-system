'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    title: 'Um lugar para se reconectar',
    subtitle: 'Retiros, eventos e capacitações em meio à natureza de Itatiaia',
    bg: 'linear-gradient(135deg, #0d1f2d 0%, #006494 100%)',
  },
  {
    title: 'Natureza & Espiritualidade',
    subtitle: 'Estrutura completa para grupos de até 400 pessoas em Penedo, RJ',
    bg: 'linear-gradient(135deg, #13293D 0%, #1a5f7a 100%)',
  },
  {
    title: 'Espaços para cada momento',
    subtitle: 'Auditório, piscina, campo, dormitórios e muito mais',
    bg: 'linear-gradient(135deg, #003d5c 0%, #13293D 100%)',
  },
]

export default function HeroHotel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  const slide = slides[current]

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh', background: slide.bg, transition: 'background 0.8s ease' }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ background: 'rgba(168,218,220,0.2)', color: '#A8DADC', border: '1px solid rgba(168,218,220,0.3)' }}
        >
          Centro Adventista · Penedo, RJ
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          {slide.title}
        </h1>

        <p className="text-lg md:text-xl mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {slide.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#reserva"
            className="px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 hover:scale-105"
            style={{ background: '#006494', boxShadow: '0 8px 24px rgba(0,100,148,0.4)' }}
          >
            Solicitar Reserva
          </a>
          <a
            href="#sobre"
            className="px-8 py-4 rounded-xl font-semibold text-base transition-all hover:bg-white/10"
            style={{ color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}
          >
            Conhecer o CATRE
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
          {[
            { val: '400+', label: 'Capacidade' },
            { val: '30+', label: 'Anos de história' },
            { val: '100+', label: 'Eventos por ano' },
            { val: 'Itatiaia', label: 'RJ, Brasil' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all rounded-full"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.08), transparent)' }}
      />
    </section>
  )
}
