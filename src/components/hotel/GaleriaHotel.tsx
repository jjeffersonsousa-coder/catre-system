'use client'
import { useState } from 'react'

const f = (name: string) => `/fotos/${encodeURIComponent(name)}`

const categorias = [
  { key: 'todos', label: 'Todos' },
  { key: 'auditorio', label: 'Auditório' },
  { key: 'quartos', label: 'Quartos' },
  { key: 'externo', label: 'Área Externa' },
  { key: 'lazer', label: 'Lazer' },
  { key: 'alimentacao', label: 'Alimentação' },
]

const fotos = [
  { src: f('Auditório-1.jpg'), label: 'Auditório Principal', cat: 'auditorio' },
  { src: f('Auditório - 2.jpg'), label: 'Auditório Principal', cat: 'auditorio' },
  { src: f('Auditório - 3.jpg'), label: 'Auditório Principal', cat: 'auditorio' },
  { src: f('Auditório - 4.jpg'), label: 'Auditório Principal', cat: 'auditorio' },
  { src: f('Auditório Secundário - 1.jpg'), label: 'Auditório Secundário', cat: 'auditorio' },
  { src: f('LED - 1.jpg'), label: 'Painel de LED', cat: 'auditorio' },
  { src: f('Quartos - 1.jpg'), label: 'Acomodações', cat: 'quartos' },
  { src: f('Quartos - 2.jpg'), label: 'Acomodações', cat: 'quartos' },
  { src: f('Quartos - 3.jpg'), label: 'Acomodações', cat: 'quartos' },
  { src: f('Quartos - 4.jpg'), label: 'Acomodações', cat: 'quartos' },
  { src: f('Quartos - 5.jpg'), label: 'Acomodações', cat: 'quartos' },
  { src: f('Área Externa - 1.jpg'), label: 'Área Externa', cat: 'externo' },
  { src: f('Área Externa - 2.png'), label: 'Área Externa', cat: 'externo' },
  { src: f('Área Externa - 3.png'), label: 'Área Externa', cat: 'externo' },
  { src: f('Área Externa - 4.jpg'), label: 'Área Externa', cat: 'externo' },
  { src: f('Área Externa - 5.jpg'), label: 'Área Externa', cat: 'externo' },
  { src: f('Área Externa - 6.jpg'), label: 'Área Externa', cat: 'externo' },
  { src: f('Área Externa - 7.jpg'), label: 'Área Externa', cat: 'externo' },
  { src: f('Piscina - 1.jpg'), label: 'Piscina', cat: 'lazer' },
  { src: f('Campo - 1.jpg'), label: 'Campo', cat: 'lazer' },
  { src: f('Campo - 2.jpg'), label: 'Campo', cat: 'lazer' },
  { src: f('Quadra - 1.jpg'), label: 'Quadra Poliesportiva', cat: 'lazer' },
  { src: f('Refeitório - 1.jpg'), label: 'Refeitório', cat: 'alimentacao' },
]

export default function GaleriaHotel() {
  const [catAtiva, setCatAtiva] = useState('todos')
  const [ampliada, setAmpliada] = useState<string | null>(null)

  const filtradas = catAtiva === 'todos' ? fotos : fotos.filter(foto => foto.cat === catAtiva)

  return (
    <section id="galeria" className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-10">
          <div className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#006494', background: '#E8F4F8' }}>
            Galeria
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#13293D' }}>
            Conheça nossos espaços
          </h2>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Estrutura pensada para o melhor aproveitamento do seu evento.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categorias.map(cat => (
            <button key={cat.key} onClick={() => setCatAtiva(cat.key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: catAtiva === cat.key ? '#13293D' : 'white',
                color: catAtiva === cat.key ? 'white' : '#374151',
                border: '1px solid',
                borderColor: catAtiva === cat.key ? '#13293D' : '#E5E7EB',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de fotos — masonry */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
          {filtradas.map((foto, i) => (
            <div key={foto.src + i}
              onClick={() => setAmpliada(foto.src)}
              className="relative rounded-xl overflow-hidden cursor-pointer group mb-3 break-inside-avoid">
              <img
                src={foto.src}
                alt={foto.label}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ display: 'block' }}
              />
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(19,41,61,0.85) 0%, transparent 55%)' }}>
                <span className="text-white text-xs font-semibold px-3 py-2.5">{foto.label}</span>
              </div>
            </div>
          ))}
        </div>

        {filtradas.length === 0 && (
          <div className="text-center py-16" style={{ color: '#9CA3AF' }}>Nenhuma foto nesta categoria.</div>
        )}
      </div>

      {/* Lightbox */}
      {ampliada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.93)' }}
          onClick={() => setAmpliada(null)}>
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all hover:bg-white/10"
            onClick={() => setAmpliada(null)}>
            ✕
          </button>
          <img
            src={ampliada}
            alt="Foto ampliada"
            className="max-w-full max-h-[88vh] rounded-xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
