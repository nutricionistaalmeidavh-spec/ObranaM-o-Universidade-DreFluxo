# Scanner Windows para documentos assinados — Design

## Objetivo

Adicionar ao Fluxo DRE Desktop um fluxo Windows-only para digitalizar, diretamente pelo scanner Epson/WIA, a versão física assinada de um documento de funcionário já gerado, revisar a prévia e arquivar um PDF vinculado ao original.

## Requisitos aprovados

- Plataforma inicial: Windows.
- Integração nativa pelo processo principal do Electron; o renderer não acessa hardware nem Node diretamente.
- Primeira tentativa de aquisição via WIA usando o Windows PowerShell 5.1/COM, sem adicionar dependência npm nativa.
- Padrão de digitalização: 300 DPI, tons de cinza.
- Opção explícita para digitalização colorida em 300 DPI.
- Uma folha por aquisição, com possibilidade de adicionar mais páginas antes de finalizar o PDF.
- Prévia de cada página, opção de refazer e opção de cancelar.
- O documento original nunca é apagado.
- O arquivo assinado usa o nome-base do original com sufixo `_ASSINADO.pdf`.
- A versão assinada fica em uma pasta `Assinados` irmã de `Não assinados` quando o original já segue essa estrutura.
- Para documentos mensais novos, a pasta da competência passa a conter `Não assinados/` e `Assinados/`.
- Arquivos mensais legados que hoje estejam diretamente na pasta da competência não são movidos automaticamente; o novo assinado é salvo em `Assinados/` dentro da mesma pasta mensal.
- Se já existir uma versão assinada, o usuário deve confirmar a substituição.
- Uma substituição confirmada preserva a versão anterior em arquivo versionado e cria um novo registro de documento, em vez de destruir histórico silenciosamente.

## Arquitetura

Fluxo: `DocumentsPage.tsx` → `window.fluxoDre.scanner` → `electron/preload.cjs` → IPC `scanner:*` em `electron/main.cjs` → `ScannerService` → Windows PowerShell/WIA → imagem temporária → `pdf-lib` → pasta gerenciada + SQLite.

O `ScannerService` mantém sessões temporárias no processo principal. Cada chamada de aquisição produz uma imagem JPEG temporária e uma prévia em data URL. Ao finalizar, o serviço monta um PDF único com todas as páginas, determina o destino assinado a partir do arquivo original, preserva uma versão anterior quando necessário, grava o novo arquivo e registra um novo item em `arquivos` e `documentos` com `status_assinatura='assinado'` e `documento_origem_id` apontando para o documento original.

## API pública do renderer

`window.fluxoDre.scanner` expõe somente:

- `capabilities()` → informa disponibilidade Windows/WIA.
- `start({ mode })` → cria sessão e digitaliza a primeira página.
- `addPage({ sessionId, mode })` → adiciona outra página.
- `redoPage({ sessionId, pageIndex, mode })` → substitui uma página da sessão.
- `discard({ sessionId })` → apaga temporários da sessão.
- `saveSigned({ sessionId, documentId, replace })` → salva o PDF e registra a versão assinada; com `replace=false`, retorna conflito se o destino já existir.

`mode` aceita `grayscale` ou `color`; a resolução permanece fixa em 300 DPI na V1.

## Interface

Na Central de documentos, documentos vinculados a funcionário e ainda não assinados recebem a ação `Digitalizar assinado`. A ação abre um modal com seleção `Tons de cinza`/`Colorido`, botão `Digitalizar`, prévia das páginas e ações `Refazer`, `Adicionar página`, `Cancelar` e `Salvar assinado`.

Após o salvamento, a lista de documentos e arquivos é recarregada; o novo registro aparece com status `assinado` e pode ser aberto/localizado normalmente.

## Pastas mensais

Para novas fichas de ponto e recibos:

```text
Recibos/
└── 2026/
    └── 09 - setembro/
        ├── Não assinados/
        │   ├── Ficha de ponto ...pdf
        │   └── Recibos ...pdf
        └── Assinados/
            ├── Ficha de ponto ..._ASSINADO.pdf
            └── Recibos ..._ASSINADO.pdf
```

A mudança vale somente para novos arquivos; nenhum arquivo já existente é migrado ou movido automaticamente.

## Segurança e falhas

- Scanner indisponível, driver WIA ausente, cancelamento no scanner e falha de aquisição retornam mensagens controladas.
- Caminhos de origem e destino são validados para permanecer dentro da raiz gerenciada de documentos.
- IDs de documento são resolvidos no processo principal; o renderer não informa um caminho arbitrário de destino.
- Sessões temporárias são limpas em `discard`, após `saveSigned` e no encerramento do app.
- O macOS não recebe implementação de scanner nesta versão; a UI informa indisponibilidade quando executada fora do Windows.

## Testes

- Testes unitários do cálculo de destino `Assinados` para estrutura nova e legada.
- Testes de sessão/validação do `ScannerService` com aquisição injetada, sem depender de hardware no CI.
- Teste de salvamento PDF, vínculo `documento_origem_id`, status assinado e preservação de versão anterior.
- Ajuste dos testes de documentos mensais para confirmar a nova pasta `Não assinados`.
- Verificação final: `npm run lint`, `npm test` e `npm run build` em `apps/desktop`.
