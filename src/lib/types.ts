export type Prioridade = 'baixa' | 'media' | 'alta' | 'urgente'
export type StatusChamado = 'aberto' | 'em_analise' | 'em_execucao' | 'aguardando_conferencia' | 'concluido'

export interface Chamado {
  id: string
  created_at: string
  data: string
  hora: string
  local: string
  categoria: string
  descricao: string
  prioridade: Prioridade
  status: StatusChamado
  responsavel?: string
  fotos?: string[]
  custo?: number
  observacoes?: string
  updated_at: string
}

export interface ManutencaoPreventiva {
  id: string
  titulo: string
  frequencia: 'mensal' | 'trimestral' | 'anual'
  descricao: string
  proximo_vencimento: string
  concluido: boolean
  created_at: string
}

export interface Depoimento {
  id: string
  nome: string
  cargo?: string
  texto: string
  aprovado: boolean
  created_at: string
}

export interface FAQ {
  id: string
  pergunta: string
  resposta: string
  ordem: number
  ativo: boolean
}

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const PRIORIDADE_COLOR: Record<Prioridade, string> = {
  baixa: '#22C55E',
  media: '#F59E0B',
  alta: '#F97316',
  urgente: '#EF4444',
}

export const STATUS_LABEL: Record<StatusChamado, string> = {
  aberto: 'Aberto',
  em_analise: 'Em Análise',
  em_execucao: 'Em Execução',
  aguardando_conferencia: 'Aguardando Conferência',
  concluido: 'Concluído',
}

export const STATUS_COLOR: Record<StatusChamado, string> = {
  aberto: '#EF4444',
  em_analise: '#F59E0B',
  em_execucao: '#3B82F6',
  aguardando_conferencia: '#8B5CF6',
  concluido: '#22C55E',
}

export const CATEGORIAS = {
  'Hospedagem': ['Quarto', 'Banheiro', 'Corredor'],
  'Áreas Comuns': ['Restaurante', 'Cozinha', 'Capela', 'Auditório'],
  'Lazer': ['Piscina', 'Campo', 'Quadra', 'Salão de Jogos'],
  'Infraestrutura': ['Elétrica', 'Hidráulica', 'Pintura', 'Jardinagem', 'Mobiliário'],
}
