# Contratos preservados — Entregas 1–19
## Entradas existentes preservadas
- Portal corporativo e `/api/bootstrap`.
- Gestão e Obra360 no mesmo runtime.
- Universidade por grant central ou sessão por celular.
- Financeiro integrado em `/api/finance/*`.
- Desktop por device token e sync por changeId/revisão.
## Novos contratos aditivos
- `GET /api/platform/context`
- `GET /api/platform/architecture`
- `GET /api/platform/executive`
- `GET /api/platform/events`
- `GET /api/platform/audit-log`
- `GET /api/platform/help`
- `POST /api/platform/assistant/route`
## Invariantes
1. Nenhuma rota protegida usa companyId arbitrário do cliente como autoridade.
2. Financeiro canônico é isolado por companyId.
3. IA é somente leitura por padrão.
4. Sync classifica cada alteração como accepted, duplicate ou conflict.
5. Migração financeira é idempotente e não remove a origem.
