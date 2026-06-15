import { BarChart3 } from 'lucide-react'

const dadosMes = [
  { mes: 'Jan', abertos: 8, concluidos: 7 },
  { mes: 'Fev', abertos: 5, concluidos: 5 },
  { mes: 'Mar', abertos: 12, concluidos: 10 },
  { mes: 'Abr', abertos: 6, concluidos: 6 },
  { mes: 'Mai', abertos: 9, concluidos: 8 },
  { mes: 'Jun', abertos: 5, concluidos: 3 },
]

const porCategoria = [
  { cat: 'Hidráulica', qtd: 14, pct: 35 },
  { cat: 'Elétrica', qtd: 12, pct: 30 },
  { cat: 'Mobiliário', qtd: 8, pct: 20 },
  { cat: 'Pintura', qtd: 4, pct: 10 },
  { cat: 'Outros', qtd: 2, pct: 5 },
]

const porLocal = [
  { local: 'Quartos (Bloco A)', qtd: 11 },
  { local: 'Banheiros', qtd: 8 },
  { local: 'Restaurante', qtd: 6 },
  { local: 'Piscina', qtd: 5 },
  { local: 'Auditórios', qtd: 4 },
  { local: 'Outros', qtd: 6 },
]

export default function RelatoriosPage() {
  const maxBar = Math.max(...dadosMes.map(d => d.abertos))

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Relatórios</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Análise de manutenções — 2026</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de Chamados', value: '45', sub: 'em 2026' },
          { label: 'Taxa de Resolução', value: '87%', sub: 'média anual' },
          { label: 'Tempo Médio', value: '2.3 dias', sub: 'até resolução' },
          { label: 'Custo Estimado', value: 'R$ 4.200', sub: 'em manutenções' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-5" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
            <div className="text-2xl font-bold" style={{ color: '#13293D' }}>{s.value}</div>
            <div className="text-xs mt-1 font-medium" style={{ color: '#374151' }}>{s.label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="rounded-xl p-6" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <h2 className="font-bold mb-6" style={{ color: '#13293D' }}>Chamados por Mês</h2>
          <div className="flex items-end gap-3 h-40">
            {dadosMes.map(d => (
              <div key={d.mes} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(d.abertos / maxBar) * 120}px`,
                      background: '#006494',
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div className="text-xs" style={{ color: '#9CA3AF' }}>{d.mes}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: '#006494' }} />
              <span className="text-xs" style={{ color: '#6B7280' }}>Abertos</span>
            </div>
          </div>
        </div>

        {/* By category */}
        <div className="rounded-xl p-6" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <h2 className="font-bold mb-6" style={{ color: '#13293D' }}>Por Categoria</h2>
          <div className="space-y-4">
            {porCategoria.map(c => (
              <div key={c.cat}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm" style={{ color: '#374151' }}>{c.cat}</span>
                  <span className="text-sm font-medium" style={{ color: '#13293D' }}>{c.qtd}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#F3F4F6' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${c.pct}%`, background: '#006494' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By location */}
        <div className="rounded-xl p-6 lg:col-span-2" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#13293D' }}>Por Local</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {porLocal.map(l => (
              <div
                key={l.local}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: '#F5F7FA' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: '#006494' }}
                >
                  {l.qtd}
                </div>
                <div className="text-sm font-medium" style={{ color: '#374151' }}>{l.local}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
