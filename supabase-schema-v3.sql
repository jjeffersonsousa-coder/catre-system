-- CATRE Penedo — Schema v3
-- Execute no SQL Editor do Supabase

-- 1. Adicionar coluna plano ao cardápio (para planos 1-4)
ALTER TABLE cardapio ADD COLUMN IF NOT EXISTS plano INTEGER DEFAULT 1;

-- 2. Limpar cardápio anterior e inserir o cardápio real
DELETE FROM cardapio;

-- Desjejum Plano 1
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco', 'cafe', 1, TRUE, 1),
('Pão Integral', 'cafe', 1, TRUE, 2),
('Pão de Queijo', 'cafe', 1, TRUE, 3),
('Ovos mexidos', 'cafe', 1, TRUE, 4),
('Bolo', 'cafe', 1, TRUE, 5),
('Patê / Geléia / Requeijão', 'cafe', 1, TRUE, 6),
('Biscoitos', 'cafe', 1, TRUE, 7),
('Granola / Sucrilhos', 'cafe', 1, TRUE, 8),
('Iogurte', 'cafe', 1, TRUE, 9),
('Leite / Mel / Nescau', 'cafe', 1, TRUE, 10),
('Mingau de Cremogema', 'cafe', 1, TRUE, 11),
('Cevada ou Café de Milho / Manteiga', 'cafe', 1, TRUE, 12),
('Suco', 'cafe', 1, TRUE, 13),
('Frutas', 'cafe', 1, TRUE, 14);

-- Desjejum Plano 2
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco', 'cafe', 2, TRUE, 1),
('Pão Integral', 'cafe', 2, TRUE, 2),
('Waffle', 'cafe', 2, TRUE, 3),
('Ovos mexidos', 'cafe', 2, TRUE, 4),
('Bolo', 'cafe', 2, TRUE, 5),
('Patê / Geléia / Requeijão', 'cafe', 2, TRUE, 6),
('Biscoitos', 'cafe', 2, TRUE, 7),
('Nescau Ball / Sucrilhos', 'cafe', 2, TRUE, 8),
('Iogurte', 'cafe', 2, TRUE, 9),
('Leite / Mel / Nescau', 'cafe', 2, TRUE, 10),
('Mingau de Aveia', 'cafe', 2, TRUE, 11),
('Cevada ou Café de Milho / Manteiga', 'cafe', 2, TRUE, 12),
('Suco', 'cafe', 2, TRUE, 13),
('Frutas', 'cafe', 2, TRUE, 14);

-- Desjejum Plano 3
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco', 'cafe', 3, TRUE, 1),
('Pão Integral', 'cafe', 3, TRUE, 2),
('Cuscuz salgado', 'cafe', 3, TRUE, 3),
('Ovos mexidos', 'cafe', 3, TRUE, 4),
('Bolo', 'cafe', 3, TRUE, 5),
('Patê / Geléia / Requeijão', 'cafe', 3, TRUE, 6),
('Biscoitos', 'cafe', 3, TRUE, 7),
('Granola / Sucrilhos', 'cafe', 3, TRUE, 8),
('Iogurte / Queijo Branco', 'cafe', 3, TRUE, 9),
('Leite / Mel / Nescau', 'cafe', 3, TRUE, 10),
('Mingau de Fubá', 'cafe', 3, TRUE, 11),
('Cevada ou Café de Milho / Manteiga', 'cafe', 3, TRUE, 12),
('Suco', 'cafe', 3, TRUE, 13),
('Frutas', 'cafe', 3, TRUE, 14);

-- Desjejum Plano 4
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco', 'cafe', 4, TRUE, 1),
('Pão Integral', 'cafe', 4, TRUE, 2),
('Batata doce ou Banana cozida', 'cafe', 4, TRUE, 3),
('Ovos mexidos', 'cafe', 4, TRUE, 4),
('Bolos', 'cafe', 4, TRUE, 5),
('Patê / Geléia / Requeijão', 'cafe', 4, TRUE, 6),
('Biscoitos', 'cafe', 4, TRUE, 7),
('Nescau Ball / Sucrilhos', 'cafe', 4, TRUE, 8),
('Iogurte / Queijo Branco', 'cafe', 4, TRUE, 9),
('Leite / Mel / Nescau', 'cafe', 4, TRUE, 10),
('Canjica', 'cafe', 4, TRUE, 11),
('Cevada ou Café de Milho / Manteiga', 'cafe', 4, TRUE, 12),
('Suco', 'cafe', 4, TRUE, 13),
('Frutas', 'cafe', 4, TRUE, 14);

-- Almoço Plano 1
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Arroz Branco', 'almoco', 1, TRUE, 1),
('Arroz Preto', 'almoco', 1, TRUE, 2),
('Feijão Preto', 'almoco', 1, TRUE, 3),
('Feijoada', 'almoco', 1, TRUE, 4),
('Couve', 'almoco', 1, TRUE, 5),
('Farofa', 'almoco', 1, TRUE, 6),
('Saladas', 'almoco', 1, TRUE, 7),
('Suco', 'almoco', 1, TRUE, 8),
('Sobremesa: Açaí', 'almoco', 1, TRUE, 9);

-- Almoço Plano 2
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Arroz Branco', 'almoco', 2, TRUE, 1),
('Arroz Integral', 'almoco', 2, TRUE, 2),
('Feijão Carioquinha', 'almoco', 2, TRUE, 3),
('Batata Gratinada', 'almoco', 2, TRUE, 4),
('Escalopinho', 'almoco', 2, TRUE, 5),
('Legumes Assados', 'almoco', 2, TRUE, 6),
('Purê', 'almoco', 2, TRUE, 7),
('Saladas', 'almoco', 2, TRUE, 8),
('Suco', 'almoco', 2, TRUE, 9),
('Sobremesa: Doce', 'almoco', 2, TRUE, 10);

-- Almoço Plano 3
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Arroz Branco', 'almoco', 3, TRUE, 1),
('Arroz Integral 7 Grãos', 'almoco', 3, TRUE, 2),
('Feijão Vermelho', 'almoco', 3, TRUE, 3),
('Strogonoff de Bife Vegetal', 'almoco', 3, TRUE, 4),
('Batata Palha', 'almoco', 3, TRUE, 5),
('Purê', 'almoco', 3, TRUE, 6),
('Saladas', 'almoco', 3, TRUE, 7),
('Suco', 'almoco', 3, TRUE, 8),
('Sobremesa: Mousse', 'almoco', 3, TRUE, 9);

-- Almoço Plano 4
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Arroz Branco', 'almoco', 4, TRUE, 1),
('Macarrão Espaguete e Penne (Spoleto)', 'almoco', 4, TRUE, 2),
('Molho Branco e Vermelho com PVT', 'almoco', 4, TRUE, 3),
('Guarnição: Milho e Ervilha', 'almoco', 4, TRUE, 4),
('Feijão', 'almoco', 4, TRUE, 5),
('Almôndegas', 'almoco', 4, TRUE, 6),
('Saladas', 'almoco', 4, TRUE, 7),
('Suco', 'almoco', 4, TRUE, 8),
('Sobremesa: Sorvete', 'almoco', 4, TRUE, 9);

-- Jantar Plano 1
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco e integral', 'jantar', 1, TRUE, 1),
('Pão variado', 'jantar', 1, TRUE, 2),
('Bolo', 'jantar', 1, TRUE, 3),
('Amendoim', 'jantar', 1, TRUE, 4),
('Yakisoba', 'jantar', 1, TRUE, 5),
('Hamburguer', 'jantar', 1, TRUE, 6),
('Caldo', 'jantar', 1, TRUE, 7);

-- Jantar Plano 2
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco e integral', 'jantar', 2, TRUE, 1),
('Pão variado', 'jantar', 2, TRUE, 2),
('Bolo', 'jantar', 2, TRUE, 3),
('Pastel', 'jantar', 2, TRUE, 4),
('Sanduíche Natural', 'jantar', 2, TRUE, 5),
('Caldo', 'jantar', 2, TRUE, 6),
('Patê', 'jantar', 2, TRUE, 7),
('Suco', 'jantar', 2, TRUE, 8);

-- Jantar Plano 3
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco e integral', 'jantar', 3, TRUE, 1),
('Pão variado', 'jantar', 3, TRUE, 2),
('Bolo', 'jantar', 3, TRUE, 3),
('Cachorro-quente', 'jantar', 3, TRUE, 4),
('Patê', 'jantar', 3, TRUE, 5),
('Rodízio de Pizza', 'jantar', 3, TRUE, 6),
('Batata Palha', 'jantar', 3, TRUE, 7),
('Suco', 'jantar', 3, TRUE, 8),
('Caldo', 'jantar', 3, TRUE, 9);

-- Jantar Plano 4
INSERT INTO cardapio (nome, tipo_refeicao, plano, disponivel, ordem) VALUES
('Pão branco e integral', 'jantar', 4, TRUE, 1),
('Pão variado', 'jantar', 4, TRUE, 2),
('Bolo', 'jantar', 4, TRUE, 3),
('Happy 10', 'jantar', 4, TRUE, 4),
('Empadão', 'jantar', 4, TRUE, 5),
('Suco', 'jantar', 4, TRUE, 6),
('Patê', 'jantar', 4, TRUE, 7),
('Caldo', 'jantar', 4, TRUE, 8);

-- 3. Tabela de quartos (dados reais da planilha)
CREATE TABLE IF NOT EXISTS quartos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER,
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  climatizacao TEXT CHECK (climatizacao IN ('ar_condicionado', 'ventilador', 'nenhum')) NOT NULL DEFAULT 'ventilador',
  capacidade INTEGER NOT NULL,
  tipo TEXT CHECK (tipo IN ('quarto', 'suite_departamental', 'suite_administracao')) NOT NULL DEFAULT 'quarto',
  observacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE
);

INSERT INTO quartos (numero, nome, localizacao, climatizacao, capacidade, tipo) VALUES
(1, 'Quarto 1', 'Térreo — Frente ao Campo', 'ventilador', 11, 'quarto'),
(2, 'Quarto 2', 'Térreo — Frente ao Campo', 'ventilador', 11, 'quarto'),
(3, 'Quarto 3', 'Térreo — Frente ao Campo (Reservado)', 'ventilador', 9, 'quarto'),
(4, 'Quarto 4', 'Térreo — Frente ao Campo', 'ar_condicionado', 9, 'quarto'),
(5, 'Quarto 5', 'Térreo — Frente ao Campo', 'ar_condicionado', 9, 'quarto'),
(6, 'Quarto 6', 'Térreo — Lado Hotel', 'ar_condicionado', 9, 'quarto'),
(7, 'Quarto 7', 'Térreo — Lado Hotel', 'ar_condicionado', 9, 'quarto'),
(8, 'Quarto 8', 'Térreo — Lado Hotel', 'ar_condicionado', 9, 'quarto'),
(9, 'Quarto 9', 'Térreo — Lado Hotel', 'ventilador', 11, 'quarto'),
(10, 'Quarto 10', 'Térreo — Lado Hotel', 'ventilador', 11, 'quarto'),
(11, 'Quarto 11', 'Superior — Frente ao Campo', 'ar_condicionado', 9, 'quarto'),
(12, 'Quarto 12', 'Superior — Frente ao Campo', 'ar_condicionado', 9, 'quarto'),
(13, 'Quarto 13', 'Superior — Frente ao Campo', 'ar_condicionado', 9, 'quarto'),
(14, 'Quarto 14', 'Superior — Lado Hotel', 'ar_condicionado', 9, 'quarto'),
(15, 'Quarto 15', 'Superior — Lado Hotel', 'ar_condicionado', 9, 'quarto'),
(16, 'Quarto 16', 'Superior — Lado Hotel', 'ar_condicionado', 9, 'quarto'),
(17, 'Quarto 17', 'Térreo — Lado Refeitório', 'ventilador', 11, 'quarto'),
(18, 'Quarto 18', 'Térreo — Lado Refeitório', 'ventilador', 11, 'quarto'),
(19, 'Quarto 19', 'Térreo — Lado Refeitório', 'ventilador', 11, 'quarto'),
(20, 'Quarto 20', 'Térreo — Lado Refeitório', 'ventilador', 11, 'quarto'),
(21, 'Quarto 21', 'Superior — Lado Refeitório', 'ventilador', 11, 'quarto'),
(22, 'Quarto 22', 'Superior — Lado Refeitório', 'ventilador', 11, 'quarto'),
(23, 'Quarto 23', 'Superior — Lado Refeitório', 'ventilador', 11, 'quarto'),
(24, 'Quarto 24', 'Superior — Lado Refeitório', 'ventilador', 11, 'quarto'),
(25, 'Quarto 25', 'Suíte Departamentais', 'ar_condicionado', 4, 'suite_departamental'),
(26, 'Quarto 26', 'Suíte Departamentais', 'ar_condicionado', 4, 'suite_departamental'),
(27, 'Quarto 27', 'Suíte Departamentais', 'ar_condicionado', 4, 'suite_departamental'),
(28, 'Quarto 28', 'Suíte Departamentais', 'ar_condicionado', 4, 'suite_departamental'),
(NULL, 'Suíte Administração 1', 'Administração', 'ar_condicionado', 3, 'suite_administracao'),
(NULL, 'Suíte Administração 2', 'Administração', 'ar_condicionado', 3, 'suite_administracao'),
(NULL, 'Suíte Administração 3', 'Administração', 'ar_condicionado', 3, 'suite_administracao');

-- RLS para quartos
ALTER TABLE quartos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados acessam quartos" ON quartos FOR ALL TO authenticated USING (TRUE);

-- 4. Ambientes do CATRE
CREATE TABLE IF NOT EXISTS ambientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nome TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('quarto', 'salao', 'area_externa', 'servico', 'administrativo', 'lazer')) NOT NULL,
  capacidade INTEGER,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE
);

ALTER TABLE ambientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados acessam ambientes" ON ambientes FOR ALL TO authenticated USING (TRUE);

INSERT INTO ambientes (nome, tipo, capacidade, descricao) VALUES
('Auditório Principal', 'salao', 300, 'Auditório com palco, sonorização e projeção'),
('Sala de Reunião A', 'salao', 50, 'Sala de reunião com projetor'),
('Sala de Reunião B', 'salao', 30, 'Sala de reunião menor'),
('Refeitório', 'servico', 200, 'Refeitório principal com cozinha'),
('Cozinha', 'servico', NULL, 'Cozinha industrial'),
('Piscina', 'lazer', 80, 'Piscina ao ar livre'),
('Quadra Esportiva', 'area_externa', 100, 'Quadra poliesportiva'),
('Campo de Futebol', 'area_externa', 200, 'Campo gramado'),
('Área de Lazer', 'area_externa', 150, 'Área verde de lazer'),
('Estacionamento', 'area_externa', NULL, 'Estacionamento para veículos e ônibus'),
('Administração', 'administrativo', NULL, 'Setor administrativo'),
('Lavanderia', 'servico', NULL, 'Lavanderia do centro');

-- 5. Tabela de hospedes por quarto na reserva
CREATE TABLE IF NOT EXISTS reserva_quartos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  quarto_id UUID REFERENCES quartos(id),
  hospedes JSONB DEFAULT '[]'
);

ALTER TABLE reserva_quartos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados acessam reserva_quartos" ON reserva_quartos FOR ALL TO authenticated USING (TRUE);

-- 6. Cardápio selecionado por dia na reserva
CREATE TABLE IF NOT EXISTS reserva_cardapio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  desjejum_plano INTEGER,
  almoco_plano INTEGER,
  jantar_plano INTEGER
);

ALTER TABLE reserva_cardapio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Autenticados acessam reserva_cardapio" ON reserva_cardapio FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Publico pode inserir reserva_cardapio" ON reserva_cardapio FOR INSERT TO anon WITH CHECK (TRUE);
