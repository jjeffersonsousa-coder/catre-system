-- CATRE Penedo — Schema v2 (novas tabelas)
-- Execute no SQL Editor do Supabase

-- Tabela de reservas (solicitações do site + manuais)
CREATE TABLE IF NOT EXISTS reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  igreja TEXT NOT NULL,
  tipo_evento TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  hospedes INTEGER NOT NULL,
  refeicoes BOOLEAN DEFAULT FALSE,
  mensagem TEXT,
  status TEXT CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'concluida')) NOT NULL DEFAULT 'pendente',
  observacao_interna TEXT,
  valor_total DECIMAL(10,2)
);

-- Tabela de cardápio
CREATE TABLE IF NOT EXISTS cardapio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  nome TEXT NOT NULL,
  tipo_refeicao TEXT CHECK (tipo_refeicao IN ('cafe', 'almoco', 'jantar', 'lanche')) NOT NULL,
  descricao TEXT,
  disponivel BOOLEAN DEFAULT TRUE,
  ordem INTEGER DEFAULT 0
);

-- Tabela de bloqueios de quartos/datas
CREATE TABLE IF NOT EXISTS bloqueios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  area TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  motivo TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('manutencao', 'reserva_especial', 'evento_interno', 'outro')) NOT NULL DEFAULT 'outro',
  ativo BOOLEAN DEFAULT TRUE
);

-- Trigger updated_at para reservas
CREATE TRIGGER trigger_reservas_updated_at
  BEFORE UPDATE ON reservas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_cardapio_updated_at
  BEFORE UPDATE ON cardapio
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardapio ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Público pode inserir reservas" ON reservas FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Autenticados acessam reservas" ON reservas FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Autenticados acessam cardapio" ON cardapio FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Autenticados acessam bloqueios" ON bloqueios FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Público pode ler cardapio disponivel" ON cardapio FOR SELECT TO anon USING (disponivel = TRUE);

-- Dados iniciais do cardápio
INSERT INTO cardapio (nome, tipo_refeicao, descricao, disponivel, ordem) VALUES
('Pão integral com manteiga', 'cafe', 'Pão caseiro com manteiga e geleia', TRUE, 1),
('Frutas da estação', 'cafe', 'Seleção de frutas frescas', TRUE, 2),
('Iogurte natural', 'cafe', 'Iogurte com granola e mel', TRUE, 3),
('Suco natural', 'cafe', 'Suco de laranja ou maracujá', TRUE, 4),
('Arroz integral', 'almoco', 'Arroz integral temperado', TRUE, 1),
('Feijão carioca', 'almoco', 'Feijão temperado com ervas', TRUE, 2),
('Salada mista', 'almoco', 'Alface, tomate, cenoura e beterraba', TRUE, 3),
('Proteína do dia', 'almoco', 'Opção proteica vegetariana ou ovo', TRUE, 4),
('Legumes refogados', 'almoco', 'Mix de legumes na manteiga', TRUE, 5),
('Sopa do dia', 'jantar', 'Sopa caseira de legumes', TRUE, 1),
('Pão e queijo', 'jantar', 'Pão artesanal com queijo', TRUE, 2),
('Salada leve', 'jantar', 'Salada de folhas verdes', TRUE, 3),
('Vitamina de frutas', 'jantar', 'Vitamina com leite ou bebida vegetal', TRUE, 4),
('Biscoito integral', 'lanche', 'Biscoito caseiro integral', TRUE, 1),
('Suco de fruta', 'lanche', 'Suco natural sem açúcar', TRUE, 2);
