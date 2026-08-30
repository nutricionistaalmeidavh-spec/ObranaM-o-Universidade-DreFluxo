# Checklist de integração

Estado das cinco entregas seguintes:

1. CI no GitHub: workflow em `.github/workflows/university-ci.yml`.
2. Contratos com validação: `packages/domain` e `packages/contracts`.
3. Fronteira de autorização: principal autenticado e acesso por obra.
4. Política de sincronização: estratégia explícita por entidade e versão.
5. Base para testes de integração: typecheck dos contratos e pipeline único
   executando Web e Desktop.

O pipeline usa `npm ci --ignore-scripts` para não executar recompilações nativas
durante a instalação. A validação funcional do Desktop continua condicionada ao
toolchain nativo documentado em `BUILD_ENVIRONMENT.md`.
