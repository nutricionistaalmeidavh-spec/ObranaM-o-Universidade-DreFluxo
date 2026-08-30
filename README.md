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

O primeiro commit criou a estrutura-base. O segundo passo importa o Fluxo DRE em `apps/desktop`, preservando seu Electron, SQLite, migrations e serviços. A Universidade será importada em `apps/web` em um commit separado. Cada etapa deve ser testada antes da integração de contratos e sincronização.

O snapshot AppDeploy de referência está registrado em [`APPDEPLOY_SYNC.md`](./APPDEPLOY_SYNC.md).
