'use client'
import { ChevronDown } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient (substituir por imagem real) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #13293D 0%, #006494 50%, #4D9FBF 100%)',
        }}
      />

      {/* Overlay pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Associação Rio Sul — Igreja Adventista
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
          Bem-vindo ao{' '}
          <span style={{ color: '#A8DADC' }}>CATRE</span>{' '}
          Penedo
        </h1>

        <p className="text-lg sm:text-xl opacity-80 max-w-2xl mx-auto mb-2">
          Centro Adventista de Treinamento
        </p>
        <p className="text-base opacity-60 mb-10">
          da Associação Rio Sul
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#reserva"
            className="px-8 py-3 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
            style={{ background: '#006494' }}
          >
            Reservar Agora
          </a>
          <a
            href="#estrutura"
            className="px-8 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95 border border-white/30"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: 'white' }}
          >
            Conheça Nossa Estrutura
          </a>
          <a
            href="#disponibilidade"
            className="px-8 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95 border border-white/30"
            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', color: 'white' }}
          >
            Consultar Disponibilidade
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '300+', label: 'Capacidade de hóspedes' },
            { value: '3', label: 'Auditórios' },
            { value: '1', label: 'Piscina' },
            { value: '24h', label: 'Segurança e controle' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#A8DADC' }}>{s.value}</div>
              <div className="text-xs opacity-60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  )
}
