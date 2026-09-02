# Motor de Produção Real Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar apontamentos reais de produção por frente com controle de tempo, equipe, resultado físico e métricas de produtividade.

**Architecture:** Estender o estado local v4 para v5 dentro do PWA existente, mantendo `days` como agregado diário e adicionando `sessions`. Funções puras calculam minutos produtivos e homem-hora; a UI diária controla a máquina de estados da sessão e o fechamento atualiza a etapa correspondente.

**Tech Stack:** HTML estático, JavaScript ES modules, IndexedDB, CSS, Vite, AppDeploy QA.

**Spec:** `docs/superpowers/specs/2026-08-18-production-engine-design.md`

## Global Constraints
- Persistência continua local-first em IndexedDB.
- Nenhum backend, SDK, segredo ou recurso externo novo.
- Migração não pode apagar dados v4.
- Horário padrão de início é 07:30.
- Planejado, executado e produzido permanecem conceitos separados.

---

### Task 1: Estado v5 e cálculos
**Files:** Modify `public/field.js`; Test `tests/tests.txt`.
**Interfaces:** Produces `days[date].sessions`, `settings.defaultWorkStart`, `sessionMinutes(session)`, `sessionManHours(session)`.
- [ ] Escrever o teste de criação de apontamento com 07:30 e persistência.
- [ ] Confirmar falha na versão v4.
- [ ] Implementar migração v5 e funções de cálculo.
- [ ] Confirmar persistência após recarregar.

### Task 2: Máquina de estados da sessão
**Files:** Modify `public/field.js`, `public/field.css`; Test `tests/tests.txt`.
**Interfaces:** Consumes sessão v5; Produces ações iniciar/pausar/retomar/concluir/editar equipe e horários.
- [ ] Escrever teste de pausar/retomar/concluir.
- [ ] Confirmar falha.
- [ ] Implementar transições com segmentos de tempo.
- [ ] Confirmar que a sessão fechada permanece após recarregar.

### Task 3: Resultado físico e equipe
**Files:** Modify `public/field.js`; Test `tests/tests.txt`.
**Interfaces:** Produces atualização da etapa e `crewEvents`.
- [ ] Escrever teste de atualização de equipe e resultado físico.
- [ ] Confirmar falha.
- [ ] Implementar atualização de equipe e fechamento com resultado.
- [ ] Confirmar que “Concluído” libera vínculos da frente.

### Task 4: Produtividade e configuração
**Files:** Modify `public/field.js`, `public/field.css`; Test `tests/tests.txt`.
**Interfaces:** Consumes sessões concluídas; Produces resumo por serviço e configuração `defaultWorkStart`.
- [ ] Escrever teste do horário configurável e resumo de produtividade.
- [ ] Confirmar falha.
- [ ] Implementar cartões de produtividade e campo de configuração.
- [ ] Confirmar persistência do horário configurado.

### Task 5: Regressão da obra
**Files:** Test `tests/tests.txt`, Modify `public/sw.js`.
- [ ] Verificar dias/planejamento/checklists existentes.
- [ ] Verificar mapa, equipe e pendências sem regressão.
- [ ] Incrementar cache do service worker.
- [ ] Rodar a suíte AppDeploy até todos os testes passarem.