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

O AppDeploy é o runtime publicado, não a fonte do código.

## Estado

O primeiro commit criou a estrutura-base. O Fluxo DRE foi importado em `apps/desktop` e a Universidade Empresarial em `apps/web`, cada um em commit separado. A integração de contratos, autenticação e sincronização ainda será feita em etapas próprias, sem misturar as implementações.

O snapshot AppDeploy de referência está registrado em [`APPDEPLOY_SYNC.md`](./APPDEPLOY_SYNC.md).
