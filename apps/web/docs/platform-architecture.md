# MH Platform v2 — arquitetura canônica
## Fonte de verdade
- Identidade e permissões: `platform_access`.
- Empresas: `companies`.
- Obras: `projects` + tabelas `project_*_<projectId>`.
- Financeiro: tabelas `afi_*_<companyId>`.
- Auditoria transversal: `platform_audit_v2`.
- Eventos de integração: `platform_integration_events_v1`.
## Contexto canônico
Toda operação autenticada resolve usuário → PlatformAccess → companyId → projectId → employeeId. O cliente nunca escolhe livremente companyId como autoridade.
## Integração
Gestão, Obra360, Universidade, Financeiro e Desktop permanecem módulos especializados. Regras determinísticas pertencem aos motores de domínio; Gemini recebe fatos estruturados e permanece somente leitura por padrão.
## Compatibilidade
O legado financeiro por userId não é apagado. A migração para `afi_*_<companyId>` é aditiva e idempotente.
