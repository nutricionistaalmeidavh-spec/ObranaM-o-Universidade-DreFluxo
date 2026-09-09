# Document Explorer Deliveries 2–6 Implementation Plan

**Status final:** concluído em 2026-09-09.

**Goal:** Evoluir o explorador interno reutilizável de documentos da leitura segura até preview, operações controladas, assinatura, scanner Epson e contexto inteligente por funcionário/competência.

**Architecture:** `FileExplorer` permanece genérico e sem acesso a Node/fs. Operações privilegiadas passam por `window.fluxoDre.explorador` → preload → IPC → `ManagedDirectoryService`; regras documentais ficam em `DocumentExplorerContextService`, ligadas ao SQLite por IDs internos. O scanner permanece isolado em `ScannerService` e é orquestrado pela UI.

**Tech Stack:** React 19, TypeScript, Electron 43, Node 22, SQLite/better-sqlite3, pdf-lib, Vitest.

**Spec:** `apps/desktop/docs/DOCUMENT_EXPLORER_MAP.md`

## Global Constraints

- [x] Renderer não acessa `fs`, paths arbitrários ou Node diretamente.
- [x] Toda operação física é restrita a uma root explicitamente autorizada e valida containment/realpath.
- [x] `..`, caminhos absolutos de destino e escapes por symlink/junction são bloqueados.
- [x] Funcionários não são identificados apenas por primeiro nome; contexto usa `funcionario_id` e CPF/ID.
- [x] Rotas, registros, scanner e fluxos anteriores foram preservados.
- [x] Operações destrutivas exigem confirmação visual.
- [x] Testes do serviço + contrato IPC + lint + build passam antes da integração.

---

### Entrega 2 — Preview interno e metadados

- [x] Testes para PDF/imagem, extensão não suportada e limite de tamanho.
- [x] MIME seguro e leitura de preview somente dentro da root gerenciada.
- [x] `explorer:preview` exposto em main/preload/types.
- [x] Preview interno com nome, tamanho, data, tipo, caminho relativo e “Abrir no Windows”.
- [x] Gate de testes/TypeScript/build.

### Entrega 3 — Operações controladas

- [x] Testes para criar/renomear/mover/remover/importar e casos de traversal/symlink/conflito.
- [x] Operações collision-safe, sem overwrite silencioso.
- [x] Importação por seletor Electron e drag-and-drop via `webUtils.getPathForFile`.
- [x] UI para criar pasta, importar, renomear, mover e excluir com confirmação.
- [x] Refresh da listagem após mutações.

### Entrega 4 — Assinados / Não assinados

- [x] Status inferido pela estrutura física e contexto SQLite.
- [x] `moveToSigned` move para a pasta irmã `Assinados` e versiona colisões.
- [x] `arquivos.caminho` e `documentos.status_assinatura` são sincronizados.
- [x] Ação de assinatura aparece somente quando aplicável.

### Entrega 5 — Fluxo Epson no explorador

- [x] Arquivo selecionado resolve `documentId` antes de digitalizar.
- [x] `DocumentScannerModal` com cinza/colorido, primeira página, adicionar, refazer, descartar e previews.
- [x] PDF assinado salvo via `ScannerService` em `Assinados`.
- [x] Conflito de versão exige confirmação explícita e preserva histórico.

> A validação física do Epson/WIA depende do equipamento e driver no Windows; a integração de software e seus contratos automatizados estão concluídos.

### Entrega 6 — Contexto inteligente

- [x] Testes com funcionários homônimos separados por CPF/ID.
- [x] Resolução por IDs/path e identidade canônica da pasta.
- [x] Competência inferida somente de `Recibos/YYYY/MM - mês`.
- [x] Índice pesquisável por funcionário, competência, categoria e status.
- [x] Visão organizada com filtros e abertura direta do arquivo físico.

### Verificação final e documentação

- [x] Novos testes incluídos no CI.
- [x] `npm test` passa.
- [x] `npm run lint` passa.
- [x] `npm run build` passa.
- [x] Testes existentes de scanner/RH permanecem verdes.
- [x] `DOCUMENT_EXPLORER_MAP.md` atualizado para Entregas 0–6.
- [x] `PROJECT_MAP.md` atualizado com arquitetura/API final.
- [x] PR apto a sair de draft após o último CI verde.
