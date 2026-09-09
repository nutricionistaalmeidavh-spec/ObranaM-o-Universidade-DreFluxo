# Document Explorer Deliveries 2–6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evoluir o explorador interno reutilizável de documentos da leitura segura até preview, operações controladas, assinatura, scanner Epson e contexto inteligente por funcionário/competência.

**Architecture:** Manter o `FileExplorer` como módulo genérico de renderer, sem acesso a Node/fs. Operações privilegiadas passam por `window.fluxoDre.explorador` → preload → IPC → `ManagedDirectoryService`; contexto de documentos fica em serviço separado, ligado ao SQLite por IDs internos. O scanner existente continua isolado no `ScannerService` e é apenas orquestrado pela UI.

**Tech Stack:** React 19, TypeScript, Electron 43, Node 22, SQLite/better-sqlite3, pdf-lib, Vitest.

**Spec:** `apps/desktop/docs/DOCUMENT_EXPLORER_MAP.md`

## Global Constraints

- Renderer nunca acessa `fs`, paths arbitrários ou Node diretamente.
- Toda operação física é restrita a uma root explicitamente autorizada e valida `path.resolve` + `realpath`.
- Bloquear `..`, caminhos absolutos de destino e symlink/junction escapes.
- Não identificar funcionário apenas por primeiro nome; usar `funcionario_id` e CPF/ID na resolução contextual.
- Preservar as rotas, registros, scanner e fluxos atuais.
- Operações destrutivas exigem confirmação visual.
- Testes do serviço + contrato IPC + build devem passar antes da integração.

---

### Task 1: Entrega 2 — Preview interno e metadados

**Files:**
- Modify: `apps/desktop/electron/services/managed-directory-service.cjs`
- Modify: `apps/desktop/electron/services/managed-directory-service.test.ts`
- Modify: `apps/desktop/electron/main.cjs`
- Modify: `apps/desktop/electron/preload.cjs`
- Modify: `apps/desktop/src/vite-env.d.ts`
- Modify: `apps/desktop/src/modules/file-explorer/types.ts`
- Modify: `apps/desktop/src/modules/file-explorer/FileExplorer.tsx`
- Modify: `apps/desktop/src/modules/file-explorer/file-explorer.css`

**Interfaces:**
- Produces: `explorador.preview(rootId, relativePath)` returning metadata plus `previewKind: 'pdf'|'image'|'unsupported'` and bounded `dataUrl` for supported files.

- [ ] Add failing tests for PDF/image preview, unsupported extension and size cap.
- [ ] Implement safe MIME detection and preview reading only inside the managed root.
- [ ] Expose `explorer:preview` through main/preload/types.
- [ ] Add preview modal/panel showing name, size, modified date, type and relative path, with “Abrir no Windows”.
- [ ] Run service tests and TypeScript/build gate.

### Task 2: Entrega 3 — Operações controladas

**Files:** same service/IPC/module files plus operation tests.

**Interfaces:**
- Produces: `createFolder`, `rename`, `move`, `remove`, `importFiles`.
- Import source paths may come only from Electron file picker or `webUtils.getPathForFile` for user drag/drop; destinations remain relative to authorized root.

- [ ] Add failing tests for create/rename/move/remove/import and traversal/symlink/conflict cases.
- [ ] Implement collision-safe filesystem operations with no overwrite by default.
- [ ] Add Electron picker import and drop-path bridge without exposing fs.
- [ ] Add UI actions, confirmations and drag/drop import.
- [ ] Verify refresh/state preservation after each operation.

### Task 3: Entrega 4 — Assinados / Não assinados

**Files:**
- Modify generic explorer types/UI.
- Add domain-aware document helper/service if needed; do not couple generic path validation to RH.

**Interfaces:**
- Produces physical signature status and `moveToSigned(rootId, relativePath)`.

- [ ] Add tests for status inference and sibling `Assinados` destination.
- [ ] Implement move (not copy) to `Assinados`, preserving target on collision via safe versioned name.
- [ ] If a managed file record exists, update `arquivos.caminho`; if a document record exists, update `status_assinatura` consistently.
- [ ] Show status badge and “Mover para assinados” only where applicable.

### Task 4: Entrega 5 — Fluxo Epson no explorador

**Files:**
- Create: `apps/desktop/src/modules/file-explorer/DocumentScannerModal.tsx`
- Modify: explorer UI/types and document context service/API.
- Reuse: `electron/services/scanner-service.cjs` and existing scanner IPC.

**Interfaces:**
- Consumes: `documentId` resolved from selected physical file.
- Uses: `scanner.capabilities/start/addPage/redoPage/discard/saveSigned`.

- [ ] Add contract tests that file→document context returns a valid internal `documentId` before scanning.
- [ ] Add scanner modal with grayscale/color, first page, add page, redo, discard and previews.
- [ ] Save signed PDF through existing scanner service into `Assinados`.
- [ ] Handle existing signed destination with explicit replace confirmation and refresh explorer/context after save.

### Task 5: Entrega 6 — Contexto inteligente

**Files:**
- Create: `apps/desktop/electron/services/document-explorer-context-service.cjs`
- Create: `apps/desktop/electron/services/document-explorer-context-service.test.ts`
- Modify: main/preload/vite types.
- Create/Modify renderer context/filter component inside `src/modules/file-explorer/`.

**Interfaces:**
- Produces: `explorador.context(rootId, relativePath)` and `explorador.index(rootId)`.
- Context item: `{ relativePath, employee:{id,nome,cpf}|null, competencia:string|null, categoria:string|null, status:string, documentId:number|null, arquivoId:number|null }`.

- [ ] Add tests with two employees sharing first name but different CPF/IDs.
- [ ] Resolve managed documents by DB IDs/path and employee folder identity containing CPF/ID.
- [ ] Infer competence only from canonical `Recibos/YYYY/MM - mês` structure.
- [ ] Return searchable index grouped/filterable by employee, competence, category and status.
- [ ] Add “Organizado” view with filters and direct navigation/preview to physical item.

### Task 6: Final verification and documentation

**Files:**
- Modify: `apps/desktop/docs/DOCUMENT_EXPLORER_MAP.md`
- Modify: `apps/desktop/docs/PROJECT_MAP.md`
- Modify: `.github/workflows/rh-docs-ci.yml`

- [ ] Add all new service tests to CI.
- [ ] Run `npm test`, `npm run lint`, `npm run build` through CI.
- [ ] Confirm existing scanner/RH tests remain green.
- [ ] Update docs with final API and delivery status.
- [ ] Keep PR in draft until all gates pass, then mark ready for review.