'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setErro('E-mail ou senha inválidos. Tente novamente.')
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #13293D 0%, #006494 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            C
          </div>
          <h1 className="text-2xl font-bold text-white">CATRE Penedo</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Área Administrativa
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: '#13293D' }}>Entrar no sistema</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                E-mail
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-blue-400"
                style={{ borderColor: '#E5E7EB', color: '#13293D' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-blue-400 pr-11"
                  style={{ borderColor: '#E5E7EB', color: '#13293D' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {erro && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: '#006494' }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} CATRE Penedo — Associação Rio Sul
        </p>
      </div>
    </div>
  )
}
