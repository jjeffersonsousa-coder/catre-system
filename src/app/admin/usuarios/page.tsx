import { Users, Plus, Shield, Wrench, Eye } from 'lucide-react'

const usuarios = [
  { nome: 'Jefferson Santos', email: 'jefferson@adventistars.org.br', perfil: 'Administrador', ativo: true },
  { nome: 'Marcos Alves', email: 'marcos@adventistars.org.br', perfil: 'Manutenção', ativo: true },
  { nome: 'Carlos Lima', email: 'carlos@adventistars.org.br', perfil: 'Manutenção', ativo: true },
  { nome: 'Ana Paula Costa', email: 'ana@adventistars.org.br', perfil: 'Recepção', ativo: true },
  { nome: 'José Santos', email: 'jose@adventistars.org.br', perfil: 'Manutenção', ativo: false },
]

const perfis = [
  { nome: 'Administrador', icon: Shield, color: '#EF4444', desc: 'Acesso total ao sistema' },
  { nome: 'Manutenção', icon: Wrench, color: '#F59E0B', desc: 'Chamados e checklist' },
  { nome: 'Recepção', icon: Users, color: '#3B82F6', desc: 'Reservas e check-in' },
  { nome: 'Visitante', icon: Eye, color: '#6B7280', desc: 'Somente leitura' },
]

export default function UsuariosPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Usuários</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Gerenciamento de acesso ao sistema</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: '#006494' }}
        >
          <Plus size={18} />
          Novo Usuário
        </button>
      </div>

      {/* Perfis */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {perfis.map(p => {
          const Icon = p.icon
          return (
            <div key={p.nome} className="rounded-xl p-4" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${p.color}15` }}
              >
                <Icon size={18} style={{ color: p.color }} />
              </div>
              <div className="font-semibold text-sm" style={{ color: '#13293D' }}>{p.nome}</div>
              <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{p.desc}</div>
            </div>
          )
        })}
      </div>

      {/* User list */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
          <h2 className="font-bold" style={{ color: '#13293D' }}>Usuários Cadastrados</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
              {['Nome', 'E-mail', 'Perfil', 'Status', 'Ações'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={i} className="border-t hover:bg-gray-50" style={{ borderColor: '#F3F4F6' }}>
                <td className="px-5 py-4 font-medium" style={{ color: '#13293D' }}>{u.nome}</td>
                <td className="px-5 py-4" style={{ color: '#6B7280' }}>{u.email}</td>
                <td className="px-5 py-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: u.perfil === 'Administrador' ? '#FEF2F2' : u.perfil === 'Manutenção' ? '#FFFBEB' : '#EFF6FF',
                      color: u.perfil === 'Administrador' ? '#EF4444' : u.perfil === 'Manutenção' ? '#F59E0B' : '#3B82F6',
                    }}
                  >
                    {u.perfil}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: u.ativo ? '#F0FDF4' : '#F9FAFB',
                      color: u.ativo ? '#22C55E' : '#9CA3AF',
                    }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${u.ativo ? 'bg-green-400' : 'bg-gray-300'}`} />
                    {u.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#F3F4F6', color: '#374151' }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
