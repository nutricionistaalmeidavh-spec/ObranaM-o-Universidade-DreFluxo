INSERT INTO configuracoes(chave, valor, updated_at)
VALUES ('mh_admission_docs_release', 'candidate', CURRENT_TIMESTAMP)
ON CONFLICT(chave) DO NOTHING;

INSERT INTO configuracoes(chave, valor, updated_at)
VALUES ('mh_admission_docs_version', '2', CURRENT_TIMESTAMP)
ON CONFLICT(chave) DO NOTHING;
