# MH Admission Docs v2

Status técnico: release candidate.

## Escopo canônico

1. Contrato de experiência
2. Ficha de registro
3. Ordem de serviço
4. Vale-transporte
5. Ficha de EPI
6. Carta de oposição sindical, quando aplicável
7. PDF oficial do eSocial anexado ao dossiê, quando importado

O antigo `livro_registro` não integra este pacote.

## Regras de geração

- Ajudante de Encanador e Encanador usam os mesmos templates canônicos; cargo, CBO, salário e demais dados vêm do cadastro.
- Antes de gerar, cada documento valida seus próprios campos obrigatórios e informa pendências por documento.
- PDFs são A4 e não recebem rodapé genérico do Fluxo DRE.
- A pasta de admissão é organizada por identificador estável do funcionário, nome e data de admissão.
- Os arquivos usam ordem estável `01` a `06`; o dossiê consolidado usa `00_Dossie_Admissao.pdf`.
- Se houver PDF oficial eSocial importado, uma cópia é adicionada ao pacote e suas páginas são anexadas ao dossiê sem recriação do documento do portal.
- Regenerações reutilizam o mesmo caminho do documento e incrementam a versão do registro no banco em vez de criar nomes por timestamp.

## Estrutura de pasta

`<Empresa>/Funcionários/<CPF-ou-ID>/<Nome>/Admissão/<AAAA-MM-DD>/`

- `00_Dossie_Admissao.pdf`
- `Não assinados/01 - Contrato de experiência.pdf`
- `Não assinados/02 - Ficha de registro.pdf`
- `Não assinados/03 - Ordem de serviço.pdf`
- `Não assinados/04 - Vale-transporte.pdf`
- `Não assinados/05 - Ficha de EPI.pdf`
- `Não assinados/06 - Carta de oposição sindical.pdf`, quando selecionada
- eSocial oficial numerado após os documentos internos, quando disponível

## Validação para aprovação do RH

A liberação definitiva exige conferência impressa de pelo menos um Ajudante de Encanador e um Encanador, comparando cada documento com o modelo-fonte do RH. Conferir texto, campos, ordem, paginação, tabelas, áreas de assinatura, margens e quebras de página.

A suíte automatizada cobre os dois cargos, os seis templates, seções estruturais críticas, ausência do rodapé legado, regras de seleção e validação de campos. Ela não substitui a aprovação visual do RH.

## Rollback

O PR permanece isolado da `main` até aprovação. Os modelos personalizados anteriores continuam disponíveis na tela de modelos, e a branch anterior/`main` permanece como rollback de código até a aprovação visual e merge. Não apagar modelos personalizados durante a transição.
