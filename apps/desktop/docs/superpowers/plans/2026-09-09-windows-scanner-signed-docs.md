# Windows Signed Document Scanner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que o Fluxo DRE Desktop digitalize uma versão assinada via WIA no Windows, mostre prévia e arquive um PDF vinculado ao documento original.

**Architecture:** Um novo `ScannerService` roda somente no processo principal do Electron e usa Windows PowerShell 5.1 + COM/WIA para adquirir imagens a 300 DPI. O renderer usa apenas IPC tipado; o serviço mantém uma sessão temporária de páginas, gera PDF com `pdf-lib` e registra a versão assinada no SQLite sem apagar a original.

**Tech Stack:** Electron 43, Node.js 22, React 19, TypeScript, Vitest, pdf-lib, Windows PowerShell 5.1/WIA.

**Spec:** `apps/desktop/docs/superpowers/specs/2026-09-09-windows-scanner-signed-docs-design.md`

## Global Constraints

- Windows-only na V1.
- 300 DPI fixos; `grayscale` padrão e `color` opcional.
- Renderer sem acesso direto a Node/hardware.
- Nenhuma dependência npm nativa nova.
- Original nunca é apagado.
- Nova versão assinada deve usar `_ASSINADO.pdf` e `documento_origem_id`.
- Substituição confirmada preserva a versão anterior.
- Arquivos legados não são movidos automaticamente.

---

### Task 1: Serviço de scanner e regras de destino

**Files:**
- Create: `apps/desktop/electron/services/scanner-service.cjs`
- Create: `apps/desktop/electron/services/scanner-service.test.ts`

**Interfaces:**
- Produces: `ScannerService`, `signedDestinationFor(originalPath)`, `signedArchivePath(destination, version)`.
- `ScannerService.start({mode})`, `addPage({sessionId,mode})`, `redoPage({sessionId,pageIndex,mode})`, `discard({sessionId})`, `saveSigned({sessionId,documentId,replace})`, `capabilities()`.

- [ ] **Step 1: Write failing tests for destination rules**

Cover:

```ts
expect(signedDestinationFor('C:\\docs\\09 - setembro\\Não assinados\\Ficha.pdf'))
  .toBe('C:\\docs\\09 - setembro\\Assinados\\Ficha_ASSINADO.pdf')
expect(signedDestinationFor('C:\\docs\\09 - setembro\\Ficha.pdf'))
  .toBe('C:\\docs\\09 - setembro\\Assinados\\Ficha_ASSINADO.pdf')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- electron/services/scanner-service.test.ts`
Expected: fail because `scanner-service.cjs` does not exist.

- [ ] **Step 3: Implement destination helpers and session validation**

Implement Windows/path-safe sibling resolution, `_ASSINADO.pdf`, session ids, allowed modes and Windows capability result.

- [ ] **Step 4: Add failing tests for scan sessions and save behavior**

Inject a fake page-acquisition function that writes a valid tiny JPEG. Assert that start/add/redo/discard manage session pages, and that save creates one PDF plus a `documentos` row with `status_assinatura='assinado'` and `documento_origem_id`.

- [ ] **Step 5: Implement WIA acquisition adapter and PDF save**

Write a temporary `.ps1` under the scanner cache and execute `%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File ...`. The script enumerates WIA scanner devices, uses the first scanner, applies X/Y resolution 300, intent grayscale/color, full available scan extents, transfers JPEG, and exits with controlled codes for no scanner/cancel/failure.

- [ ] **Step 6: Implement version-preserving replacement**

If `_ASSINADO.pdf` exists and `replace=false`, return `{conflict:true}`. If `replace=true`, rename the previous managed signed file to `_ASSINADO_vN.pdf`, update its `arquivos` path/name, then create the new canonical signed PDF and a new document version.

- [ ] **Step 7: Run focused tests until GREEN**

Run: `npm test -- electron/services/scanner-service.test.ts`
Expected: pass.

---

### Task 2: IPC e API pública

**Files:**
- Modify: `apps/desktop/electron/main.cjs`
- Modify: `apps/desktop/electron/preload.cjs`
- Modify: `apps/desktop/src/vite-env.d.ts`

**Interfaces:**
- Consumes: `ScannerService` from Task 1.
- Produces: `window.fluxoDre.scanner` with the six methods defined in the spec.

- [ ] **Step 1: Add IPC contract expectations to scanner service test or a small preload contract test**

Assert method names and payload shapes used by the renderer.

- [ ] **Step 2: Wire `ScannerService` in `createServices()`**

Construct with `{db, fileService: files, dataDir: paths.dataDir}` and expose IPC channels `scanner:capabilities`, `scanner:start`, `scanner:add-page`, `scanner:redo-page`, `scanner:discard`, `scanner:save-signed`.

- [ ] **Step 3: Expose preload methods**

Add `scanner` group using existing `call()` helper; do not expose paths or Node objects.

- [ ] **Step 4: Add TypeScript declarations**

Define `ScannerMode = 'grayscale'|'color'`, page/session result shapes and the scanner API on `Window.fluxoDre`.

- [ ] **Step 5: Run TypeScript check**

Run: `npm run lint`
Expected: pass.

---

### Task 3: Estrutura mensal de Não assinados / Assinados

**Files:**
- Modify: `apps/desktop/electron/services/time-service.cjs`
- Modify: `apps/desktop/electron/services/time-service.test.ts`

**Interfaces:**
- Produces: novos documentos mensais em `<competência>/Não assinados/`; scanner resolve o irmão `<competência>/Assinados/`.

- [ ] **Step 1: Write failing monthly-folder test**

Change/add assertion so a generated ficha/recibo path contains `09 - setembro/Não assinados/` and the parent monthly folder still exists.

- [ ] **Step 2: Verify RED**

Run: `npm test -- electron/services/time-service.test.ts`
Expected: fail because current files are written directly into the monthly folder.

- [ ] **Step 3: Change generation destination**

Create `monthlyFolder`, `unsignedFolder=path.join(monthlyFolder,'Não assinados')` and `signedFolder=path.join(monthlyFolder,'Assinados')`; create both recursively, write generated PDFs only to `unsignedFolder`, and return both folders without moving legacy files.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- electron/services/time-service.test.ts`
Expected: pass.

---

### Task 4: Modal de digitalização na Central de documentos

**Files:**
- Modify: `apps/desktop/src/pages/DocumentsPage.tsx`

**Interfaces:**
- Consumes: `window.fluxoDre.scanner`.
- Produces: ação `Digitalizar assinado`, modal de modo/captura/prévia e confirmação de conflito.

- [ ] **Step 1: Add UI state and action eligibility**

Only show scan action for documents with `funcionario_id` and `status_assinatura !== 'assinado'` when scanner capabilities report supported/available.

- [ ] **Step 2: Add scan modal**

Default mode to `grayscale`; provide radio/select for `Tons de cinza` and `Colorido`, scan first page, thumbnails/previews, `Refazer`, `Adicionar página`, `Cancelar` and `Salvar assinado`.

- [ ] **Step 3: Handle overwrite confirmation**

Call `saveSigned(...replace:false)`. On `{conflict:true}`, show existing `Confirm`; only then repeat with `replace:true`.

- [ ] **Step 4: Reload document/file lists after save**

On success close modal, discard session defensively, reload `docs` and `files`, and show a concise success status.

- [ ] **Step 5: Run TypeScript check**

Run: `npm run lint`
Expected: pass.

---

### Task 5: Project map and full verification

**Files:**
- Modify: `apps/desktop/docs/PROJECT_MAP.md`

- [ ] **Step 1: Document the new scanner subsystem**

Add `scanner-service.cjs`, `window.fluxoDre.scanner`, IPC channels and Windows/WIA limitation to the project map.

- [ ] **Step 2: Run focused and full tests**

Run:

```bash
npm test -- electron/services/scanner-service.test.ts
npm test -- electron/services/time-service.test.ts
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 3: Verify diff scope**

Confirm only scanner service/tests, monthly-folder generation/tests, IPC/preload/types, DocumentsPage, project map and planning/spec docs changed.
