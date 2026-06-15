export default function ConfiguracoesPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#13293D' }}>Configurações</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Configurações gerais do sistema CATRE</p>
      </div>

      <div className="space-y-6">
        {/* Informações gerais */}
        <div className="rounded-xl p-6" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#13293D' }}>Informações do CATRE</h2>
          <div className="space-y-4">
            {[
              { label: 'Nome do Centro', value: 'CATRE Penedo' },
              { label: 'Cidade', value: 'Penedo — Alagoas' },
              { label: 'Associação', value: 'Associação Rio Sul (ARS)' },
              { label: 'Telefone', value: '(82) 0000-0000' },
              { label: 'E-mail', value: 'catre@adventistars.org.br' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>{f.label}</label>
                <input
                  type="text"
                  defaultValue={f.value}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Banco de dados */}
        <div className="rounded-xl p-6" style={{ background: 'white', boxShadow: '0 1px 8px rgba(19,41,61,0.07)' }}>
          <h2 className="font-bold mb-2" style={{ color: '#13293D' }}>Integração Supabase</h2>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Configure as variáveis de ambiente no arquivo <code className="bg-gray-100 px-1 rounded">.env.local</code>
          </p>
          <div className="rounded-lg p-4 font-mono text-xs" style={{ background: '#F5F7FA' }}>
            <div style={{ color: '#6B7280' }}># .env.local</div>
            <div style={{ color: '#006494' }}>NEXT_PUBLIC_SUPABASE_URL=<span style={{ color: '#374151' }}>sua_url_aqui</span></div>
            <div style={{ color: '#006494' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY=<span style={{ color: '#374151' }}>sua_chave_aqui</span></div>
          </div>
          <div
            className="mt-4 flex items-center gap-2 p-3 rounded-lg"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
          >
            <span style={{ color: '#F59E0B' }}>⚠️</span>
            <p className="text-xs" style={{ color: '#D97706' }}>
              Sem o Supabase configurado, o sistema funciona com dados de exemplo (mock).
              Para produção, configure as variáveis acima.
            </p>
          </div>
        </div>

        <button
          className="w-full py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: '#006494' }}
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  )
}
