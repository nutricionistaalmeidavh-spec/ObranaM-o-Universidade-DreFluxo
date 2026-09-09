# Mapa do gerenciador de documentos

Revisão: 2026-09-09

Este documento registra o estado final das **Entregas 0–6** do gerenciador interno de arquivos do Fluxo DRE. O explorador permanece reutilizável: a navegação e as operações de filesystem são genéricas; regras de funcionário, competência, assinatura e scanner ficam em uma camada documental separada.

## Raiz gerenciada

A documentação física é controlada por `DocumentRootService`.

- Raiz padrão: `%APPDATA%\\fluxo-dre\\documentos` no Windows.
- Configurável pelo usuário em Configurações (`configuracoes.documentos_pasta_raiz`).
- `FileService.documentsDir` acompanha a raiz configurada.
- O banco registra arquivos em `arquivos.caminho`; documentos apontam para `documentos.arquivo_id`.
- O renderer trabalha com `rootId` + caminho relativo. Caminhos arbitrários do computador não são aceitos como destino.

Root atualmente autorizada:

```text
documents → DocumentRootService.getRoot()
```

## Estruturas físicas preservadas

### Funcionários

```text
<raiz>/
  <empresa>/
    Funcionários/
      <nome> - <CPF ou ID>/
        Documentação Geral/
        Recibos/
          YYYY/
            MM - mês/
              Não assinados/
              Assinados/
```

A identidade de contexto nunca é resolvida apenas pelo primeiro nome. O serviço usa o vínculo exato do banco quando existe e, para arquivos ainda não registrados, usa o CPF/ID presente na pasta do funcionário.

### Obras

```text
<raiz>/
  Obras/
    <obra>/
      <categoria>/
```

## Arquitetura final

```text
DocumentsPage
  ↓
FileExplorer (genérico)
  ↓ window.fluxoDre.explorador
preload.cjs
  ↓ IPC explorer:*
ManagedDirectoryService ───────────────→ filesystem
  ↑
  └─ roots nomeadas + validação de caminho

DocumentIndexView / ações documentais
  ↓ explorer:context / explorer:index / explorer:move-to-signed
DocumentExplorerContextService
  ↓                         ↓
SQLite                    filesystem validado

DocumentScannerModal
  ↓ window.fluxoDre.scanner
ScannerService
  ↓
Windows PowerShell 5.1 / WIA / Epson
```

## Módulo reutilizável

```text
src/modules/file-explorer/
  FileExplorer.tsx
  DocumentIndexView.tsx
  DocumentScannerModal.tsx
  file-explorer.css
  types.ts
  index.ts
```

`FileExplorer` aceita `rootId`, `rootLabel`, `initialPath` e textos opcionais. Recursos específicos de documentos são habilitados pela prop `documentFeatures`; sem ela, o componente continua sendo um explorador genérico de uma root autorizada.

## Entrega 1 — navegação segura

- grade de pastas/arquivos;
- busca na pasta atual;
- breadcrumb e voltar;
- atualizar;
- abrir no Windows;
- symlinks/junctions bloqueados;
- validação por `path.resolve` e `realpath`;
- sem acesso a Node/fs no renderer.

## Entrega 2 — preview e metadados

`ManagedDirectoryService.preview()` suporta preview interno limitado de:

- PDF;
- PNG/JPEG/GIF/WebP/BMP.

O retorno contém somente metadados relativos: nome, extensão, tamanho, data, MIME e tipo de preview. O conteúdo é limitado a 12 MB por padrão; arquivos maiores ou tipos não suportados continuam disponíveis por **Abrir no Windows**.

## Entrega 3 — operações controladas

Operações disponíveis somente dentro da root autorizada:

- criar pasta;
- renomear;
- mover;
- excluir com confirmação;
- importar por seletor do Electron;
- importar por drag-and-drop usando `webUtils.getPathForFile`.

Proteções:

- nomes inválidos e nomes reservados do Windows são rejeitados;
- não há overwrite silencioso;
- pasta não pode ser movida para dentro dela mesma;
- symlinks não podem ser modificados/importados;
- importação em lote faz preflight e compensa cópias parciais em erro;
- renomear/mover arquivos já registrados atualiza `arquivos.caminho`;
- exclusão física remove o vínculo de arquivo e marca documentos correspondentes como excluídos.

## Entrega 4 — Assinados / Não assinados

`DocumentExplorerContextService` reconhece o status físico e oferece `moveToSigned()`.

- ação só aparece para arquivo em `Não assinados`;
- destino é a pasta irmã `Assinados`;
- conflito nunca sobrescreve: `Arquivo.pdf` vira `Arquivo (2).pdf`, etc.;
- `arquivos.caminho` e `documentos.status_assinatura` são atualizados em transação;
- em falha do banco, o rename físico é revertido.

## Entrega 5 — scanner Epson

`DocumentScannerModal` reutiliza o `ScannerService` já endurecido.

Fluxo:

1. arquivo em `Não assinados` resolve seu `documentId` interno;
2. usuário escolhe **Cinza** ou **Colorido**;
3. captura uma página por vez via WIA a 300 DPI;
4. pode adicionar ou refazer páginas;
5. revisa as imagens;
6. salva PDF multipágina em `Assinados`;
7. se já existir versão assinada, a substituição exige confirmação e preserva histórico.

A comunicação física com o Epson real depende do Windows, driver WIA e equipamento conectado; a integração de software está preparada, mas a prova física final só pode ocorrer no computador com o scanner.

## Entrega 6 — contexto inteligente

`DocumentExplorerContextService.context()` retorna:

```ts
{
  relativePath,
  employee: { id, nome, cpf } | null,
  competencia,
  categoria,
  status,
  documentId,
  arquivoId
}
```

`index()` percorre arquivos físicos sem seguir symlinks e cria a visão **Organizado**, com filtros por:

- funcionário;
- competência;
- categoria;
- status de assinatura;
- texto/caminho.

Competência só é inferida da estrutura canônica `Recibos/YYYY/MM - mês`. Funcionários homônimos permanecem separados por `funcionario_id`/CPF.

## API pública do explorador

```text
explorador.list
explorador.preview
explorador.open
explorador.createFolder
explorador.rename
explorador.move
explorador.remove
explorador.pickImport
explorador.importFiles
explorador.pathForFile
explorador.context
explorador.index
explorador.moveToSigned
```

Toda operação privilegiada termina no processo principal; `contextIsolation`, `nodeIntegration: false` e sandbox continuam preservados.

## Central de documentos

`/documentos` mantém duas áreas:

- **Pastas**: explorador físico, preview, organização, assinatura, scanner e visão organizada;
- **Registros**: central anterior baseada no SQLite, preservando filtros, importações e ações existentes.

## Fora do escopo após a Entrega 6

Não foram adicionados deliberadamente:

- watcher contínuo do filesystem;
- sincronização em nuvem das pastas físicas;
- OCR/indexação de conteúdo;
- edição interna de PDF/Office;
- seleção múltipla em massa.

Esses recursos podem ser adicionados posteriormente reutilizando as mesmas roots nomeadas e contratos IPC.