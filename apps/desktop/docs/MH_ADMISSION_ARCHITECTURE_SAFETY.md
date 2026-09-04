# MH Admission Docs v2 — arquitetura e gates de segurança

## Escopo revisado
A implementação de documentos admissionais permanece isolada no desktop, atrás do IPC existente `documents:generate`. Não foram criados novos canais IPC nem alteradas as APIs públicas usadas por financeiro, folha, obras, compras, contratos, RDO ou sincronização online.

## Fluxo validado
`EmployeeRegistrationPage` -> `window.fluxoDre.documentos.generate` -> preload existente -> IPC `documents:generate` -> `DocumentService.generate` -> templates oficiais MH -> `BrowserWindow.printToPDF` -> arquivos/documentos SQLite -> dossiê.

## Banco e migrações
- Migrações 014–016 são incrementais e preservam as tabelas existentes.
- A migração 014 adiciona os campos cadastrais necessários e apenas desativa referências ao obsoleto `livro_registro`.
- A migração 015 registra `MH Admission Docs v2` como candidate.
- A migração 016 adiciona `cargo_epi_kits` sem substituir `epis` ou `funcionario_epis`.
- Há teste automatizado de banco novo e de upgrade de um banco v13 contendo funcionário existente.
- O fluxo atual do `DatabaseService` cria backup pré-migração de bancos existentes. A API `better-sqlite3.backup()` é assíncrona e o serviço atual não aguarda explicitamente seu término; o teste de compatibilidade aguarda a produção do backup para detectar regressões. Tratar eventual refatoração desse comportamento separadamente, para não misturar risco estrutural ao release de RH.

## Compatibilidade de arquivos
- A raiz configurável de documentos continua sendo `fileService.documentsDir`; a estrutura admissional é criada abaixo dela.
- Pastas são identificadas por CPF/ID + nome + data de admissão, evitando colisão por homônimo.
- Regeneração reutiliza o caminho determinístico e incrementa versão/revisão do registro.
- eSocial continua sendo PDF externo oficial e somente é anexado ao dossiê.

## EPI
- `funcionario_epis` continua sendo a fonte de entregas do funcionário.
- Na geração, somente o registro mais recente por EPI é considerado, evitando duplicação visual por múltiplas gravações do wizard.
- `cargo_epi_kits` fornece a quantidade-padrão de impressão por cargo, incluindo Uniforme 03 e Protetor Solar PT.

## Testes e plataformas
Gates obrigatórios antes de merge:
1. RH Docs CI: migração nova + upgrade v13 + políticas + templates + golden tests + build desktop.
2. CI integrado: contratos/typecheck + web + desktop tests + desktop build.
3. Windows: testes + build + geração real dos PDFs via Electron + artefato de fixtures + NSIS.
4. macOS Apple Silicon: testes + build + DMG arm64 em pull request.
5. Revisão visual dos PDFs de Ajudante e Encanador.
6. Aprovação do RH antes de tirar o PR de draft.

## Resultado visual esperado
Cada cargo deve gerar seis PDFs internos e `00_Dossie_Admissao.pdf`. O dossiê atual contém 8 páginas: Contrato (2), Ficha de Registro (1), Ordem de Serviço (2), Vale-Transporte (1), Ficha EPI (1), Carta Sindical (1). O eSocial acrescenta suas páginas somente quando o PDF oficial estiver importado para o funcionário.

## Não regressão
O PR deve permanecer draft enquanto qualquer gate estiver pendente. Não alterar `main` nem publicar release de produção até a aprovação visual do RH. Modelos personalizados anteriores permanecem disponíveis como rollback funcional, enquanto o antigo `livro_registro` continua fora do pacote canônico.
