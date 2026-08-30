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

Este primeiro commit cria somente a estrutura-base. A importação dos dois sistemas ocorrerá em commits separados, com testes de Web e Desktop a cada etapa.
