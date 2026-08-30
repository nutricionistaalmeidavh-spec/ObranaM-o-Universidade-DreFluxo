# Validação das aplicações

Registro da validação isolada no monorepo, em 30/08/2026.

## Universidade Empresarial (Web)

- `npm run test:web`: aprovado — 15 arquivos, 76 testes.
- `npm run build:web`: aprovado — build Vite concluído.
- Observação: o Vite mantém `./guide/mh-neutral.webp` para resolução em runtime,
  aviso já existente e não bloqueante.

## Fluxo DRE (Desktop)

- `npm run test:desktop`: bloqueado no ambiente atual — o executável `vitest` não
  está instalado no workspace do Desktop.
- `npm run build:desktop`: bloqueado no ambiente atual — `tsc` não está instalado
  no workspace do Desktop.

Esses dois resultados são bloqueios de dependências locais, não falhas funcionais
confirmadas do código. A instalação completa deve ser feita usando Node 20 LTS e
o toolchain C++/Windows SDK descrito em [BUILD_ENVIRONMENT.md](BUILD_ENVIRONMENT.md).
