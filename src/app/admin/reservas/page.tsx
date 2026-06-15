import { CalendarCheck, Plus } from 'lucide-react'
import Link from 'next/link'

export default function ReservasPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Reservas</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Gerenciamento de reservas e disponibilidade</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: '#006494' }}
        >
          <Plus size={18} />
          Nova Reserva
        </button>
      </div>

      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}
      >
        <CalendarCheck size={48} className="mx-auto mb-4" style={{ color: '#A8DADC' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: '#13293D' }}>Módulo de Reservas</h2>
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
          Este módulo será integrado ao sistema de reservas online.<br />
          Conecte ao Supabase para habilitar funcionalidade completa.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold"
          style={{ background: '#006494' }}
        >
          ← Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}
