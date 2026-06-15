'use client'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const categorias = ['Todos', 'Quartos', 'Restaurante', 'Capela', 'Auditórios', 'Piscina', 'Campo', 'Quadra', 'Áreas Externas']

// Placeholder images (em produção, viram do Supabase Storage)
const fotos = [
  { id: 1, categoria: 'Quartos', titulo: 'Quarto Coletivo', emoji: '🛏️', color: '#13293D' },
  { id: 2, categoria: 'Quartos', titulo: 'Quarto Familiar', emoji: '🏠', color: '#006494' },
  { id: 3, categoria: 'Restaurante', titulo: 'Refeitório Principal', emoji: '🍽️', color: '#4D9FBF' },
  { id: 4, categoria: 'Restaurante', titulo: 'Cozinha Industrial', emoji: '👨‍🍳', color: '#13293D' },
  { id: 5, categoria: 'Capela', titulo: 'Chapel Principal', emoji: '⛪', color: '#006494' },
  { id: 6, categoria: 'Auditórios', titulo: 'Auditório Central', emoji: '🎤', color: '#4D9FBF' },
  { id: 7, categoria: 'Auditórios', titulo: 'Sala de Reuniões', emoji: '📋', color: '#13293D' },
  { id: 8, categoria: 'Piscina', titulo: 'Área da Piscina', emoji: '🏊', color: '#006494' },
  { id: 9, categoria: 'Campo', titulo: 'Campo de Futebol', emoji: '⚽', color: '#22C55E' },
  { id: 10, categoria: 'Quadra', titulo: 'Quadra Poliesportiva', emoji: '🏀', color: '#F97316' },
  { id: 11, categoria: 'Áreas Externas', titulo: 'Área de Convivência', emoji: '🌿', color: '#4D9FBF' },
  { id: 12, categoria: 'Áreas Externas', titulo: 'Entrada Principal', emoji: '🚪', color: '#13293D' },
]

export default function Galeria() {
  const [catAtiva, setCatAtiva] = useState('Todos')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtradas = catAtiva === 'Todos' ? fotos : fotos.filter(f => f.categoria === catAtiva)
  const lightboxIdx = lightbox !== null ? filtradas.findIndex(f => f.id === lightbox) : -1

  const prev = () => {
    if (lightboxIdx > 0) setLightbox(filtradas[lightboxIdx - 1].id)
  }
  const next = () => {
    if (lightboxIdx < filtradas.length - 1) setLightbox(filtradas[lightboxIdx + 1].id)
  }

  return (
    <section id="galeria" className="py-20 px-4" style={{ background: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#006494' }}>
            Galeria de Fotos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#13293D' }}>
            Conheça Cada Espaço
          </h2>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatAtiva(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: catAtiva === cat ? '#006494' : 'white',
                color: catAtiva === cat ? 'white' : '#13293D',
                border: `1.5px solid ${catAtiva === cat ? '#006494' : '#E8F4F8'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtradas.map((foto) => (
            <button
              key={foto.id}
              onClick={() => setLightbox(foto.id)}
              className="relative rounded-2xl overflow-hidden aspect-square group transition-transform hover:-translate-y-1 hover:shadow-xl"
              style={{ boxShadow: '0 2px 12px rgba(19,41,61,0.1)' }}
            >
              {/* Placeholder — em prod vira <Image src={foto.url} ... /> */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${foto.color}, ${foto.color}99)` }}
              >
                <span className="text-5xl mb-2">{foto.emoji}</span>
                <span className="text-white/70 text-xs font-medium">{foto.categoria}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                <div className="p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {foto.titulo}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Upload notice for admin */}
        <p className="text-center mt-8 text-sm" style={{ color: '#9CA3AF' }}>
          As fotos serão exibidas aqui após upload no painel administrativo
        </p>
      </div>

      {/* Lightbox */}
      {lightbox !== null && lightboxIdx !== -1 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>

          <button
            className="absolute left-4 text-white/70 hover:text-white disabled:opacity-20"
            onClick={(e) => { e.stopPropagation(); prev() }}
            disabled={lightboxIdx === 0}
          >
            <ChevronLeft size={36} />
          </button>

          <div
            className="w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-2xl flex flex-col items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${filtradas[lightboxIdx].color}, ${filtradas[lightboxIdx].color}99)` }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-8xl mb-4">{filtradas[lightboxIdx].emoji}</span>
            <span className="text-white font-semibold text-lg">{filtradas[lightboxIdx].titulo}</span>
          </div>

          <button
            className="absolute right-4 text-white/70 hover:text-white disabled:opacity-20"
            onClick={(e) => { e.stopPropagation(); next() }}
            disabled={lightboxIdx === filtradas.length - 1}
          >
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-6 text-white/50 text-sm">
            {lightboxIdx + 1} / {filtradas.length}
          </div>
        </div>
      )}
    </section>
  )
}
