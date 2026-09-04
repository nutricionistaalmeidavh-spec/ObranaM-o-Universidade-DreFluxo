CREATE TABLE IF NOT EXISTS cargo_epi_kits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cargo_id INTEGER NOT NULL REFERENCES cargos(id) ON DELETE CASCADE,
  epi_id INTEGER NOT NULL REFERENCES epis(id) ON DELETE CASCADE,
  quantidade_texto TEXT NOT NULL DEFAULT '01',
  ativo INTEGER NOT NULL DEFAULT 1,
  UNIQUE(cargo_id, epi_id)
);

INSERT OR IGNORE INTO cargo_epi_kits(cargo_id, epi_id, quantidade_texto)
SELECT c.id, e.id,
  CASE
    WHEN lower(e.nome) = 'uniforme' THEN '03'
    WHEN lower(e.nome) = 'protetor solar' THEN 'PT'
    ELSE '01'
  END
FROM cargos c
JOIN epis e ON lower(e.nome) IN (
  'uniforme','botina','capacete com jugular','protetor auditivo','protetor solar','touca árabe',
  'luva multitato','óculos de proteção','máscara pff2','cinto de segurança com talabarte e trava-quedas'
)
WHERE lower(c.nome) IN ('encanador','ajudante de encanador');

CREATE INDEX IF NOT EXISTS idx_cargo_epi_kits_cargo ON cargo_epi_kits(cargo_id, ativo);
