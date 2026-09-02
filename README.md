# ObraNaMão · Universidade · DREFluxo

Monorepo de integração do produto operacional:

- `apps/web`: operação de campo, portal e Universidade Empresarial;
- `apps/desktop`: Fluxo DRE para gestão pesada, Electron e SQLite;
- `packages/`: contratos, domínio, autenticação, sincronização e educação;
- `docs/`: arquitetura, integração e decisões técnicas;
- `training/`: materiais de treinamento preservados.

## Fonte de verdade

Este repositório será a fonte versionada da integração. Os repositórios históricos continuam preservados:

- `nutricionistaalmeidavh-spec/UniversidadeEmpresarial`
- `nutricionistaalmeidavh-spec/drefluxo`

O AppDeploy é o runtime publicado. Após a reconciliação de 2026-09-02, o snapshot v93 foi trazido de volta ao monorepo para restabelecer o Git como fonte versionada.

## Estado

O FluxoDRE Desktop está em `apps/desktop`; campo, portal, Universidade e backend online estão em `apps/web`. O Desktop permanece offline-first, mas agora possui vínculo opcional com o backend para sincronização, Financeiro Inteligente e recursos online.

O snapshot AppDeploy de referência está registrado em [`APPDEPLOY_SYNC.md`](./APPDEPLOY_SYNC.md).
