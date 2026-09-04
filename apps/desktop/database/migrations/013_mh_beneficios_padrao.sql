-- Valores vigentes dos benefícios mensais da MH.
-- Corrige catálogo, vínculos por cargo, overrides existentes e lançamentos ainda pendentes.
-- Histórico já pago permanece inalterado.

UPDATE beneficios
SET valor_padrao_centavos = 51000
WHERE lower(nome) LIKE '%aliment%';

UPDATE beneficios
SET valor_padrao_centavos = 18000
WHERE nome LIKE '%Café%' OR lower(nome) LIKE '%cafe%';

UPDATE cargo_beneficios
SET valor_centavos = 51000
WHERE beneficio_id IN (SELECT id FROM beneficios WHERE lower(nome) LIKE '%aliment%');

UPDATE cargo_beneficios
SET valor_centavos = 18000
WHERE beneficio_id IN (SELECT id FROM beneficios WHERE nome LIKE '%Café%' OR lower(nome) LIKE '%cafe%');

INSERT OR IGNORE INTO cargo_beneficios(cargo_id,beneficio_id,valor_centavos,quinzena,natureza,ativo)
SELECT c.id,b.id,
       CASE WHEN lower(b.nome) LIKE '%aliment%' THEN 51000 ELSE 18000 END,
       1,'credito',1
FROM cargos c
CROSS JOIN beneficios b
WHERE lower(b.nome) LIKE '%aliment%' OR b.nome LIKE '%Café%' OR lower(b.nome) LIKE '%cafe%';

UPDATE funcionario_beneficios
SET valor_centavos = 51000
WHERE beneficio_id IN (SELECT id FROM beneficios WHERE lower(nome) LIKE '%aliment%');

UPDATE funcionario_beneficios
SET valor_centavos = 18000
WHERE beneficio_id IN (SELECT id FROM beneficios WHERE nome LIKE '%Café%' OR lower(nome) LIKE '%cafe%');

UPDATE folha_lancamentos
SET valor_centavos = 51000, updated_at = CURRENT_TIMESTAMP
WHERE status = 'pendente'
  AND natureza = 'credito'
  AND (lower(descricao) LIKE '%aliment%' OR tipo IN (
    SELECT 'beneficio_' || id FROM beneficios WHERE lower(nome) LIKE '%aliment%'
  ));

UPDATE folha_lancamentos
SET valor_centavos = 18000, updated_at = CURRENT_TIMESTAMP
WHERE status = 'pendente'
  AND natureza = 'credito'
  AND (descricao LIKE '%Café%' OR lower(descricao) LIKE '%cafe%' OR tipo IN (
    SELECT 'beneficio_' || id FROM beneficios WHERE nome LIKE '%Café%' OR lower(nome) LIKE '%cafe%'
  ));
