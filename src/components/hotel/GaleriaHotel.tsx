const imagens = [
  { label: 'Auditório Principal', aspect: 'tall' },
  { label: 'Área da Piscina', aspect: 'wide' },
  { label: 'Refeitório', aspect: 'normal' },
  { label: 'Dormitórios', aspect: 'normal' },
  { label: 'Área Verde', aspect: 'wide' },
  { label: 'Campo Esportivo', aspect: 'normal' },
]

const colors = [
  '#13293D', '#006494', '#4D9FBF', '#1a5f7a', '#0d4d6e', '#2a7fa0',
]

export default function GaleriaHotel() {
  return (
    <section id="galeria" className="py-20 px-4" style={{ background: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: '#006494', background: '#E8F4F8' }}
          >
            Galeria
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#13293D' }}>
            Conheça nossos espaços
          </h2>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Estrutura pensada para o melhor aproveitamento do seu evento.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imagens.map((img, i) => (
            <div
              key={img.label}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                background: colors[i],
                height: i === 0 || i === 4 ? 280 : 200,
              }}
            >
              {/* Placeholder gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${colors[i]} 0%, ${colors[(i + 2) % colors.length]} 100%)`,
                  opacity: 0.9,
                }}
              />

              {/* Pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Label overlay */}
              <div
                className="absolute inset-0 flex items-end p-5"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                }}
              >
                <span className="text-white font-semibold text-sm">{img.label}</span>
              </div>

              {/* Hover */}
              <div
                className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100"
                style={{ background: 'rgba(0,100,148,0.2)' }}
              />
            </div>
          ))}
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: '#9CA3AF' }}>
          Fotos reais serão adicionadas em breve. Entre em contato para uma visita presencial.
        </p>
      </div>
    </section>
  )
}
