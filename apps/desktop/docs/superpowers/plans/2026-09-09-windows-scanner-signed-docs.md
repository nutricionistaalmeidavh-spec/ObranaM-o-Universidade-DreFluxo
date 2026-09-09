# Windows Signed Document Scanner — Final Status

> **Status de software:** concluído em 2026-09-09. A única etapa restante é a aceitação física com o Epson/WIA em um Windows real.

**Goal:** permitir que o Fluxo DRE Desktop digitalize versões assinadas de documentos de funcionários via scanner WIA no Windows, revise as páginas antes do salvamento e arquive o PDF assinado sem apagar o original.

**Architecture:** `ScannerService` roda somente no processo principal do Electron e usa Windows PowerShell 5.1 + COM/WIA. O renderer acessa o scanner apenas pela API tipada do preload/IPC. O gerenciador de pastas usa uma raiz documental controlada e compartilha o mesmo modal de digitalização com a Central de Documentos.

**Tech Stack:** Electron 43, Node.js 22, React 19, TypeScript, Vitest, pdf-lib, Windows PowerShell 5.1/WIA.

**Spec:** `apps/desktop/docs/superpowers/specs/2026-09-09-windows-scanner-signed-docs-design.md`

## Roadmap final

| Entrega | Estado | Resultado |
| --- | --- | --- |
| 1. Segurança do serviço | ✅ Concluída | Detecção WIA, exclusão de operações simultâneas, cancelamento seguro, 300 DPI, cinza/colorido, rollback físico/SQLite, validação de destino e preservação do original. |
| 2. Organização mensal | ✅ Concluída | Documentos mensais novos em `Não assinados/`, pasta irmã `Assinados/`, compatibilidade com legados e separação segura de homônimos por CPF/ID. |
| 3. Fluxo visual completo | ✅ Concluída | Modal compartilhado com prévia, refazer página, adicionar página, cinza/colorido, cancelar/descartar e conflito de substituição; disponível tanto em `Pastas` quanto em `Registros`. |
| 4. Validação integrada | ✅ Concluída | Scanner, gerenciador, contexto documental, IPC, elegibilidade da Central, integração visual, lint e build cobertos pelo `RH Docs CI`. |
| 5. Epson real | 🧪 Aceitação manual | Exige o scanner Epson e o driver WIA no Windows do usuário. Não há código pendente para esta etapa. |

## Gerenciador de pastas

O roadmap do gerenciador permanece separado em:

`apps/desktop/docs/superpowers/plans/2026-09-09-document-explorer-deliveries-2-6.md`

As Entregas 0–6 desse módulo estão concluídas. A Central de Documentos mantém duas visões complementares:

- **Pastas:** navegação física protegida, preview, criar/importar/arrastar/renomear/mover/excluir, `Assinados`/`Não assinados`, scanner e visão organizada.
- **Registros:** cadastro SQLite existente, filtros e ações históricas, agora também com `Digitalizar versão assinada` quando o documento é de funcionário, ainda não está assinado e há scanner WIA disponível.

## Regras preservadas

- Scanner direto é Windows-only na V1.
- 300 DPI fixos.
- `grayscale` é o padrão; `color` continua opcional.
- Renderer não recebe acesso direto a Node, filesystem ou hardware.
- Nenhuma dependência npm nativa nova foi adicionada.
- Documento original nunca é apagado pelo fluxo de digitalização.
- A versão assinada usa `_ASSINADO.pdf` e `documento_origem_id`.
- Substituição confirmada arquiva a versão assinada anterior antes de publicar a nova.
- Arquivos legados não são movidos automaticamente.
- Paths manipulados pelo gerenciador ficam restritos à raiz autorizada e rejeitam traversal/symlinks que escapem da área gerenciada.
- Identidade de funcionário não depende de primeiro nome; usa vínculos de banco e CPF/ID.

## Fluxo final

```text
Central de Documentos
├── Pastas
│   └── arquivo em Não assinados
│       └── Digitalizar versão assinada
└── Registros
    └── documento de funcionário não assinado
        └── Digitalizar versão assinada

Digitalizar
  ↓
ScannerService / WIA
  ↓
Cinza ou Colorido · 300 DPI
  ↓
Prévia das páginas
  ├── Refazer página
  ├── Adicionar página
  └── Cancelar e descartar
  ↓
Gerar PDF
  ↓
Assinados/
  ↓
SQLite atualizado
  ↓
Pastas + Registros recarregados
```

## Evidência automatizada final

O workflow `.github/workflows/rh-docs-ci.yml` executa o conjunto de regressão relevante, incluindo:

- `scanner-service.test.ts`
- `time-service.test.ts`
- `managed-directory-service.test.ts`
- `document-explorer-context-service.test.ts`
- `scanner-ipc-contract.test.ts`
- `documents-scanner-ui-contract.test.ts`
- `scanner-eligibility.test.ts`
- testes de migração/RH relacionados
- `npm run lint`
- `npm run build`

A validação automatizada cobre falhas de banco, rollback físico, concorrência, cancelamento, conflito de versão, organização mensal, homônimos, IPC e integração visual da Central.

## Aceitação física Epson

A etapa manual deve ser executada depois da instalação no Windows alvo:

1. Conectar o Epson e confirmar driver WIA instalado.
2. Abrir `Central de documentos`.
3. Selecionar documento de funcionário em `Não assinados` ou em `Registros`.
4. Testar primeira página em cinza.
5. Testar página colorida.
6. Adicionar uma segunda página.
7. Refazer uma página.
8. Cancelar uma sessão e confirmar ausência de temporários publicados.
9. Salvar e conferir PDF em `Assinados/`.
10. Repetir salvamento para validar conflito, confirmação e histórico.
11. Conferir atualização da lista de Registros e do SQLite.

Esta aceitação física é um teste de hardware/driver, não uma entrega de implementação pendente.
