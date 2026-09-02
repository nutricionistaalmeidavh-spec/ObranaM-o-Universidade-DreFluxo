# Sincronização AppDeploy

- App: Obra na Mão / FluxoDRE Campo integrado
- AppDeploy: `fluxodre-campo-b2u-clbfo5`
- URL: https://fluxodre-campo-b2u-clbfo5.v2.appdeploy.ai/
- Snapshot operacional reconciliado: `1788127731278`
- Versão AppDeploy: `v93`
- Publicado em: 2026-08-30T22:08:51.278Z
- Estado verificado: `ready`
- QA AppDeploy: sem erros de frontend ou backend na última verificação.

## Estado da reconciliação

Em 2026-09-02 foi identificado que o runtime AppDeploy v93 estava à frente do monorepo integrado. O código online crítico foi reconciliado de volta para `apps/web`, incluindo Platform Core, contexto/isolamento por empresa, acesso, auditoria, vínculo de Desktop, sincronização e Financeiro Inteligente.

O Desktop em `apps/desktop` recebeu uma ponte online própria, mantendo o banco SQLite local e o funcionamento offline. O vínculo do computador é autorizado pelo navegador e usa token de dispositivo persistido localmente.

## Regra de fonte de verdade

- `apps/desktop`: fonte versionada do Desktop.
- `apps/web`: fonte versionada do runtime web/backend reconciliado com o AppDeploy v93.
- AppDeploy: ambiente publicado.
- Novos deploys devem partir do Git e manter este arquivo atualizado para evitar nova divergência.
