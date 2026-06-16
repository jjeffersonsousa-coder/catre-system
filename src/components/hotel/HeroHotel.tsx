'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const f = (name: string) => `/fotos/${encodeURIComponent(name)}`

const slides = [
  {
    foto: f('Área Externa - 1.jpg'),
    title: 'Um lugar para se reconectar',
    subtitle: 'Retiros, eventos e capacitações em meio à natureza de Itatiaia',
  },
  {
    foto: f('Piscina - 1.jpg'),
    title: 'Natureza & Espiritualidade',
    subtitle: 'Estrutura completa para grupos de até 400 pessoas em Itatiaia, RJ',
  },
  {
    foto: f('Auditório-1.jpg'),
    title: 'Espaços para cada momento',
    subtitle: 'Auditórios, piscina, campo, quadra, refeitório e muito mais',
  },
  {
    foto: f('Quartos - 1.jpg'),
    title: 'Acomodações confortáveis',
    subtitle: 'Quartos bem equipados para grupos de todos os tamanhos',
  },
  {
    foto: f('Campo - 1.jpg'),
    title: 'Área de lazer completa',
    subtitle: 'Campo, quadra poliesportiva e amplos espaços ao ar livre',
  },
]

export default function HeroHotel() {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState<boolean[]>(slides.map(() => false))

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [])

  // Pré-carrega a próxima foto
  useEffect(() => {
    slides.forEach((s, i) => {
      const img = new Image()
      img.src = s.foto
      img.onload = () => setLoaded(prev => { const n = [...prev]; n[i] = true; return n })
    })
  }, [])

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  return (
    <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Slides de foto */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundImage: `url('${slide.foto}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}

      {/* Overlay escuro */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,31,45,0.55) 0%, rgba(13,31,45,0.65) 60%, rgba(13,31,45,0.8) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ background: 'rgba(168,218,220,0.2)', color: '#A8DADC', border: '1px solid rgba(168,218,220,0.3)' }}
        >
          Centro Adventista · Itatiaia, RJ
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          {slides[current].title}
        </h1>

        <p className="text-lg md:text-xl mb-10" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {slides[current].subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#reserva"
            className="px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 hover:scale-105"
            style={{ background: '#006494', boxShadow: '0 8px 24px rgba(0,100,148,0.5)' }}
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
      <button onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/20 z-20"
        style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
        <ChevronLeft size={22} />
      </button>
      <button onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/20 z-20"
        style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="transition-all rounded-full"
            style={{ width: i === current ? 28 : 8, height: 8, background: i === current ? 'white' : 'rgba(255,255,255,0.4)' }} />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.06), transparent)' }} />
    </section>
  )
}
