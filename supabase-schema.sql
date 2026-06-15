-- CATRE Penedo — Schema SQL para Supabase
-- Execute este arquivo no SQL Editor do Supabase

-- Tabela de chamados de manutenção
CREATE TABLE IF NOT EXISTS manutencao_chamados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  data DATE NOT NULL,
  hora TIME NOT NULL,
  local TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT NOT NULL,
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')) NOT NULL DEFAULT 'media',
  status TEXT CHECK (status IN ('aberto', 'em_analise', 'em_execucao', 'aguardando_conferencia', 'concluido')) NOT NULL DEFAULT 'aberto',
  responsavel TEXT,
  fotos TEXT[] DEFAULT '{}',
  custo DECIMAL(10,2),
  observacoes TEXT
);

-- Tabela de manutenção preventiva
CREATE TABLE IF NOT EXISTS manutencao_preventiva (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  titulo TEXT NOT NULL,
  frequencia TEXT CHECK (frequencia IN ('mensal', 'trimestral', 'anual')) NOT NULL,
  descricao TEXT NOT NULL,
  proximo_vencimento DATE NOT NULL,
  concluido BOOLEAN DEFAULT FALSE
);

-- Tabela de depoimentos
CREATE TABLE IF NOT EXISTS depoimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nome TEXT NOT NULL,
  cargo TEXT,
  texto TEXT NOT NULL,
  aprovado BOOLEAN DEFAULT FALSE
);

-- Tabela de FAQ
CREATE TABLE IF NOT EXISTS faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE
);

-- Histórico de ambientes (para rastrear manutenções por local)
CREATE TABLE IF NOT EXISTS historico_ambiente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ambiente TEXT NOT NULL,
  chamado_id UUID REFERENCES manutencao_chamados(id),
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_updated_at
  BEFORE UPDATE ON manutencao_chamados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS) - Habilitar para produção
ALTER TABLE manutencao_chamados ENABLE ROW LEVEL SECURITY;
ALTER TABLE manutencao_preventiva ENABLE ROW LEVEL SECURITY;
ALTER TABLE depoimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme necessidade)
CREATE POLICY "Público pode ler FAQ" ON faq FOR SELECT TO anon USING (ativo = TRUE);
CREATE POLICY "Público pode ler depoimentos aprovados" ON depoimentos FOR SELECT TO anon USING (aprovado = TRUE);
CREATE POLICY "Autenticados acessam chamados" ON manutencao_chamados FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Autenticados acessam preventiva" ON manutencao_preventiva FOR ALL TO authenticated USING (TRUE);

-- Dados iniciais de FAQ
INSERT INTO faq (pergunta, resposta, ordem, ativo) VALUES
('Qual o horário de check-in?', 'O check-in é realizado a partir das 14h.', 1, TRUE),
('Qual o horário de check-out?', 'O check-out deve ser realizado até as 12h (meio-dia).', 2, TRUE),
('Crianças pagam?', 'Crianças até 5 anos não pagam. De 6 a 12 anos, pagam 50%.', 3, TRUE),
('Posso levar roupa de cama?', 'Sim! Você pode trazer sua própria roupa de cama e toalhas.', 4, TRUE),
('Como funciona a alimentação?', 'O CATRE oferece café da manhã, almoço e jantar com cardápios planejados.', 5, TRUE),
('Como faço uma reserva?', 'Clique em "Reservar Agora" no site ou entre em contato com a administração.', 6, TRUE);

-- Dados iniciais de manutenção preventiva
INSERT INTO manutencao_preventiva (titulo, frequencia, descricao, proximo_vencimento, concluido) VALUES
('Verificação Elétrica', 'mensal', 'Inspecionar quadros, tomadas e disjuntores', '2026-07-01', FALSE),
('Verificação Hidráulica', 'mensal', 'Checar torneiras, registros e caixas d água', '2026-07-01', FALSE),
('Manutenção da Piscina', 'mensal', 'Limpeza, pH e cloro da piscina', '2026-06-20', FALSE),
('Revisão de Iluminação', 'mensal', 'Substituir lâmpadas queimadas em todos os ambientes', '2026-07-01', FALSE),
('Pintura e Caiação', 'trimestral', 'Verificar desgaste e necessidade de pintura', '2026-09-01', FALSE),
('Revisão de Equipamentos', 'trimestral', 'Geladeiras, ar condicionado, chuveiros e bombas', '2026-09-01', FALSE),
('Controle de Pragas', 'trimestral', 'Dedetização e controle de pragas geral', '2026-09-01', FALSE),
('Reforma Preventiva', 'anual', 'Revisão geral das instalações e reformas necessárias', '2027-01-01', FALSE),
('Revisão Estrutural', 'anual', 'Verificação de telhado, fundação e estrutura', '2027-01-01', FALSE);
