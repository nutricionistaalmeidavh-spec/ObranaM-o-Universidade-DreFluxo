# Ambiente de build integrado

O monorepo usa Node.js 20 LTS e npm 10 ou superior. Essa versão é o ponto comum
entre o Vite da Universidade Empresarial e o Electron do Fluxo DRE.

## Preparação

1. Ative Node 20 (por exemplo, com nvm) e confirme `node --version`.
2. Na raiz do monorepo, execute `npm ci`.
3. Para o Desktop no Windows, mantenha instalado o workload **Desktop development
   with C++** e o Windows SDK. O pacote `better-sqlite3` usa esses componentes
   quando precisa compilar o módulo nativo.

## Validação

```text
npm ci
npm run test:web
npm run build:web
npm run test:desktop
npm run build:desktop
```

Node 24 não é o ambiente de referência: além de sair da faixa declarada, pode
forçar uma recompilação nativa do `better-sqlite3` e falhar quando o SDK do
Windows não estiver disponível.
