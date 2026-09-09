# MH Commercial Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar o MH com contexto global, hubs, refinamentos visuais e Assistente IA compartilháveis do comercial sem importar infraestrutura SaaS nem regredir scanner/documentos/RH.

**Architecture:** Portabilidade seletiva sobre a base MH, preservando rotas e serviços locais. Cada bloco entra de forma aditiva e testável; IA usa o IPC/OnlineService já existente e somente leitura. Nenhum merge integral entre repositórios.

**Tech Stack:** Electron 43.4.1, React 19, TypeScript, Vite, Vitest, SQLite/better-sqlite3.

**Spec:** `docs/superpowers/specs/2026-09-09-mh-commercial-parity-design.md`

## Global Constraints
- Baseline funcional MH: `e70d4e77240f481003f3ce78df817000ed72a9af`.
- Não substituir scanner, documentos, file registry, managed directories, migrations ou templates MH.
- Não portar Asaas, billing, planos, licenciamento, owner comercial, D1/R2 comercial, OAuth comercial, appId ou release channel comercial.
- Rotas existentes continuam válidas.
- IA é somente leitura e a chave do provedor não pode ficar no executável.

---

### Task 1: Contexto global de obra

**Files:**
- Create/port: `apps/desktop/src/hooks/useWorkContext.tsx`
- Modify: `apps/desktop/src/App.tsx`
- Test: `apps/desktop/src/hooks/useWorkContext.test.tsx` ou contrato equivalente existente

**Interfaces:**
- Produces: `WorkContextProvider` e hook de seleção/contexto de obra.

- [ ] Escrever teste que prove que o provider preserva seleção e não altera registros.
- [ ] Confirmar falha antes da implementação.
- [ ] Portar/adaptar provider comercial sem dependências SaaS.
- [ ] Rodar teste e suíte relacionada.
- [ ] Commit isolado.

### Task 2: Hubs de Configurações e Compras/Contratos

**Files:**
- Create/port: `apps/desktop/src/pages/SettingsHubPage.tsx`
- Create/port: `apps/desktop/src/pages/ProcurementContractsHubPage.tsx`
- Modify: `apps/desktop/src/App.tsx`
- Test: contratos de roteamento/navegação.

**Interfaces:**
- Existing routes `/compras`, `/contratos`, `/documentos`, `/importacao`, `/configuracoes` remain valid.
- New route `/compras-contratos` groups existing actions.

- [ ] Escrever testes de compatibilidade das rotas antigas e novas.
- [ ] Confirmar falha.
- [ ] Portar hubs adaptando branding e sem lógica comercial.
- [ ] Rodar testes e build de rotas.
- [ ] Commit isolado.

### Task 3: Camada visual Command Center compartilhável

**Files:**
- Port/adapt selected styles from commercial `apps/desktop/src/modules/command-center/`.
- Modify shell/navigation files only where needed.
- Test: existing UI contract tests plus route coverage.

**Interfaces:**
- Classic layout remains available.
- Command Center loads additive ArtiSys/MH style layers without changing business services.

- [ ] Criar/ajustar teste de carregamento das folhas de estilo e ausência de regressão de layout clássico.
- [ ] Confirmar falha.
- [ ] Portar somente estilos/componentes genéricos.
- [ ] Rodar testes/build.
- [ ] Commit isolado.

### Task 4: Assistente IA MH

**Files:**
- Create/port: `apps/desktop/src/pages/AiAssistantPage.tsx`
- Create/port: `apps/desktop/src/pages/ai-assistant.css`
- Create/port: `apps/desktop/src/utils/ai-context.ts`
- Modify: `apps/desktop/src/App.tsx`
- Verify/adapt: `apps/desktop/src/vite-env.d.ts`
- Verify existing: `apps/desktop/electron/preload.cjs`, `apps/desktop/electron/main.cjs`, `apps/desktop/electron/services/online-service.cjs`
- Tests: AI payload + online timeout/IPC contracts.

**Interfaces:**
- `window.fluxoDre.online.aiAnalyze(input)` already exists on MH and must remain the transport.
- `buildAiAnalysisPayload()` returns compact `facts`, `alerts`, `ranking`, `route`, `context`.

- [ ] Escrever/portar teste para inferência de domínios e payload determinístico.
- [ ] Confirmar falha porque util/tela ainda não existem no MH.
- [ ] Portar `ai-context.ts` adaptando marca e mantendo somente dados agregados.
- [ ] Portar tela e CSS da IA.
- [ ] Adicionar `/assistente-ia` ao roteamento.
- [ ] Validar tipagem de `online.aiAnalyze` e IPC existente.
- [ ] Garantir timeout dedicado de IA sem aumentar timeout das demais chamadas, se necessário.
- [ ] Rodar testes/build.
- [ ] Commit isolado.

### Task 5: Contrato compartilhado de sync

**Files:**
- Evaluate/port: `packages/contracts/src/desktop-sync.ts`
- Modify exports only if required.
- Tests: contract parsing/validation.

**Interfaces:**
- Does not alter MH data model or migrate database.

- [ ] Escrever teste do contrato esperado.
- [ ] Confirmar falha.
- [ ] Portar apenas contrato genérico necessário.
- [ ] Rodar package tests/typecheck.
- [ ] Commit isolado.

### Task 6: Gates de proteção MH

**Files:**
- Add regression/CI contract test if necessary under `.github` or desktop tests.

**Interfaces:**
- Protected files remain MH-specific.

- [ ] Validar que `appId=br.com.fluxodre.app` e `productName=Fluxo DRE` permanecem.
- [ ] Validar ausência de Asaas/billing/licensing importados.
- [ ] Rodar testes de scanner/documentos já existentes.
- [ ] Rodar `npm test`, `npm run lint`, `npm run build` em Desktop e testes/build Web aplicáveis.
- [ ] Revisar diff para confirmar ausência de migrations e zonas protegidas inesperadas.
- [ ] Commit final de gates/documentação, abrir PR e aguardar CI antes de merge.
