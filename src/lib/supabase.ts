import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Suporte ao novo formato de chave (sb_publishable_) e ao formato legado (anon JWT)
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      manutencao_chamados: {
        Row: {
          id: string
          created_at: string
          data: string
          hora: string
          local: string
          categoria: string
          descricao: string
          prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
          status: 'aberto' | 'em_analise' | 'em_execucao' | 'aguardando_conferencia' | 'concluido'
          responsavel: string | null
          fotos: string[]
          custo: number | null
          observacoes: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['manutencao_chamados']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['manutencao_chamados']['Insert']>
      }
      manutencao_preventiva: {
        Row: {
          id: string
          titulo: string
          frequencia: 'mensal' | 'trimestral' | 'anual'
          descricao: string
          proximo_vencimento: string
          concluido: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['manutencao_preventiva']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['manutencao_preventiva']['Insert']>
      }
      depoimentos: {
        Row: {
          id: string
          nome: string
          cargo: string | null
          texto: string
          aprovado: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['depoimentos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['depoimentos']['Insert']>
      }
      faq: {
        Row: {
          id: string
          pergunta: string
          resposta: string
          ordem: number
          ativo: boolean
        }
        Insert: Omit<Database['public']['Tables']['faq']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['faq']['Insert']>
      }
    }
  }
}
