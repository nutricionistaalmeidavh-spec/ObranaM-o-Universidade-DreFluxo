# FluxoDRE Campo v6 Multiusuário Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrar o FluxoDRE Campo para Admin/Encarregado/Funcionário com Auth, banco central e importação dos dados locais.

**Architecture:** frontend PWA usa auth/api; backend resolve membership e aplica RBAC; estado operacional é particionado para respeitar 64 KiB por item; IndexedDB segue como cache local.

**Tech Stack:** HTML/CSS/JS PWA, @appdeploy/client, TypeScript backend com @appdeploy/sdk auth/router/db.

**Spec:** docs/superpowers/specs/2026-08-19-multiuser-v6-design.md

## Global Constraints
- Preservar IndexedDB atual.
- Horário padrão 07:30.
- Admin total; Encarregado presença/falta + leitura operacional; Funcionário somente próprias tarefas.
- Autorização obrigatória no backend.
- Exatamente 5 testes E2E e um [sanity].

### Task 1: Backend/RBAC
- [ ] Implementar bootstrap por tenant, membership, projeto e auditoria.
- [ ] Implementar projeto compartilhado, importação, membros, presença e minhas tarefas.

### Task 2: Frontend/Auth
- [ ] Login/logout, onboarding Admin, migração local, cache remoto e tratamento offline.

### Task 3: Admin
- [ ] Configurações > Usuários com papel e vínculo a funcionário.

### Task 4: Encarregado
- [ ] Leitura operacional e presença/falta persistida no backend.

### Task 5: Funcionário
- [ ] Tela Minha semana filtrada por employeeId.

### Task 6: Verificação
- [ ] Service worker, 5 E2E, logs limpos e mesma URL.