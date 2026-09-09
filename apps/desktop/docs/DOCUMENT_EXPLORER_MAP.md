# Mapa do gerenciador de documentos

Revisão: 2026-09-09

Este documento registra o contrato da Entrega 0 e a fronteira implementada na Entrega 1 do explorador interno de arquivos. O objetivo é permitir evolução segura do gerenciador sem acoplar a interface a uma estrutura específica de RH, obras ou scanner.

## Raiz gerenciada

A documentação física é controlada por `DocumentRootService`.

- Raiz padrão: `%APPDATA%\\fluxo-dre\\documentos` no Windows.
- A raiz pode ser alterada pelo usuário em Configurações.
- A configuração é persistida em `configuracoes`, chave `documentos_pasta_raiz`.
- `FileService.documentsDir` acompanha a raiz configurada.
- O banco continua registrando arquivos em `arquivos.caminho`; os registros de domínio apontam para `documentos.arquivo_id`.

O explorador não recebe caminhos absolutos do renderer. A interface trabalha somente com um `rootId` autorizado e caminhos relativos.

## Estruturas físicas existentes

### Documentos de funcionários importados

`FileService.employeeFolders()` usa a identidade completa disponível, e não apenas o primeiro nome:

```text
<raiz>/
  <empresa>/
    Funcionários/
      <nome> - <CPF ou ID>/
        Não assinados/
        Assinados/
        Documentação Geral/
```

Isso preserva a separação entre funcionários homônimos quando CPF ou ID diferem.

### Documentos mensais de ponto e benefícios

O fluxo mensal usa a base do funcionário e a competência:

```text
<funcionário>/
  Recibos/
    YYYY/
      MM - mês/
```

No branch de scanner em desenvolvimento existe teste exigindo a evolução desta competência para:

```text
MM - mês/
  Não assinados/
  Assinados/
```

A implementação do explorador é deliberadamente agnóstica a essa transição: ele lista o que estiver fisicamente presente sob a raiz autorizada, sem migrar, renomear ou reorganizar arquivos.

### Scanner de versões assinadas

`ScannerService` recebe um documento já gerenciado e calcula um destino dentro da mesma área de documentos. Quando o original está em `Não assinados`, a versão digitalizada é direcionada à pasta irmã `Assinados`; em outros casos, cria/usa `Assinados` junto ao diretório do original. O arquivo final usa sufixo `_ASSINADO.pdf` e versões anteriores são preservadas quando há substituição controlada.

### Documentos de obras

Os anexos de obra usam a estrutura:

```text
<raiz>/
  Obras/
    <obra>/
      <categoria>/
```

Categorias incluem documentos de obra, RDO, medição, contrato, compra, nota fiscal, ART/RRT, foto e outros tipos registrados pelo fluxo existente.

## Tela `/documentos` antes da Entrega 1

`DocumentsPage.tsx` já oferecia uma central baseada nos registros do banco:

- filtros por categoria, obra e frente;
- busca por título/categoria;
- importação de documento de obra ou funcionário;
- abertura do arquivo no aplicativo padrão;
- localização no Explorer do sistema;
- cópia de caminho;
- remoção do cadastro com preservação física por padrão.

Esse comportamento foi preservado na aba **Registros**.

## Módulo reutilizável da Entrega 1

### Renderer

```text
src/modules/file-explorer/
  FileExplorer.tsx
  file-explorer.css
  types.ts
  index.ts
```

`FileExplorer` depende somente do contrato `window.fluxoDre.explorador` e das propriedades:

- `rootId`;
- `rootLabel`;
- `initialPath`;
- textos opcionais de título/descrição/estado vazio.

Por isso o mesmo componente poderá ser reutilizado futuramente para documentos de RH, obras, contratos ou outras raízes explicitamente autorizadas, sem copiar a lógica de navegação.

### Processo principal

```text
Renderer
  ↓ window.fluxoDre.explorador
preload.cjs
  ↓ IPC explorer:list / explorer:open
ManagedDirectoryService
  ↓ raiz nomeada autorizada
filesystem
```

`ManagedDirectoryService` é genérico e recebe um mapa de raízes. Nesta entrega existe apenas:

```text
documents → DocumentRootService.getRoot()
```

Adicionar outra área no futuro exige registrá-la explicitamente no processo principal; o renderer não pode escolher um caminho arbitrário do computador.

## Contrato de segurança da Entrega 1

O explorador é somente leitura em relação ao sistema de arquivos.

- não expõe `fs` ao renderer;
- não aceita caminho absoluto;
- rejeita segmentos `..`;
- valida contenção após `path.resolve`;
- valida contenção também após `realpath`, evitando escape por links simbólicos;
- links simbólicos são exibidos como bloqueados e não podem ser abertos pelo módulo;
- somente raízes previamente cadastradas podem ser acessadas;
- não existem métodos para criar, renomear, mover, copiar, sobrescrever ou excluir arquivos/pastas.

A única ação externa é `open`, que usa `shell.openPath` depois das validações e pode abrir uma pasta ou arquivo existente no aplicativo padrão do sistema operacional.

## Comportamento da aba Pastas

A aba **Pastas** da Central de documentos:

- lista a raiz física configurada;
- mostra pastas antes de arquivos;
- usa grade visual;
- mostra extensão/tamanho/data de arquivos;
- navega por clique, breadcrumb e voltar;
- busca somente dentro da pasta atual;
- atualiza a listagem sob demanda;
- abre a pasta atual ou uma subpasta no Windows;
- abre um arquivo no aplicativo padrão do Windows;
- não altera nenhum arquivo.

## Fora do escopo das Entregas 0 e 1

Continuam para entregas posteriores:

- preview interno de PDF/imagem;
- criação de pasta;
- renomear, mover, copiar ou excluir;
- importação por arrastar e soltar;
- seleção múltipla;
- observação automática do filesystem;
- status semântico de assinatura na própria grade;
- vínculo visual direto com a sessão do scanner.

Essas funções devem reutilizar o módulo atual e ampliar o contrato de forma incremental, com operações privilegiadas separadas e validação própria no processo principal.
