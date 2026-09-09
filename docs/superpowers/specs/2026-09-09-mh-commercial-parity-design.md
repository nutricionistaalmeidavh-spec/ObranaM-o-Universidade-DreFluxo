# MH ↔ Comercial: paridade segura de núcleo

## Objetivo
Atualizar a edição privada MH com melhorias compartilháveis da edição comercial sem alterar identidade, dados, documentos, scanner, migrations ou integrações privadas da MH.

## Base
- Repositório MH: `nutricionistaalmeidavh-spec/ObranaM-o-Universidade-DreFluxo`
- Baseline: `e70d4e77240f481003f3ce78df817000ed72a9af`
- Fonte de referência comercial: `nutricionistaalmeidavh-spec/OBRANAMAOCOMERCIAL`

## Estratégia
A atualização é uma portabilidade seletiva, nunca um merge integral entre os repositórios. O MH mantém como fonte de verdade seu banco SQLite, serviços de RH, documentos, scanner Epson/WIA, geração de arquivos, migrations e identidade do aplicativo. A edição comercial fornece apenas componentes e padrões que sejam genéricos e seguros.

## Entregas
1. Preservar baseline e zonas protegidas do MH.
2. Portar o contexto global de obra (`WorkContextProvider`) sem modificar dados existentes.
3. Portar a organização visual Command Center/ArtiSys de forma aditiva.
4. Adicionar hubs de Configurações e Compras/Contratos mantendo todas as rotas antigas válidas.
5. Integrar Assistente IA no MH como recurso somente leitura, usando dados locais resumidos e o endpoint `online.aiAnalyze()` já existente no Electron.
6. Não portar billing, Asaas, planos, licenciamento, owner comercial, D1/R2 comercial, OAuth comercial, secrets comerciais, appId comercial ou canal de release comercial.
7. Manter scanner, documentos e caminhos registrados exatamente sob as regras endurecidas do MH.

## IA no MH
A IA deve funcionar como camada interpretativa, não como fonte de verdade e não como mecanismo de escrita. O Desktop monta um payload determinístico e compacto com indicadores financeiros, obras, pessoas e tarefas. A chave do provedor não deve ficar embutida no executável. A chamada deve passar pelo backend online configurado para a edição MH.

A UI pode reutilizar a tela do Assistente IA comercial, adaptando textos de marca para MH/Fluxo DRE. A rota `/assistente-ia` deve existir no Desktop, mas a IA não deve ser inserida como item pesado no menu se o shell global já oferecer acesso contextual; o acesso pode ser feito por card/atalho compatível com a direção definida para IA global.

## Zonas protegidas
Não substituir automaticamente:
- `apps/desktop/database/**`
- `apps/desktop/electron/services/scanner-*`
- `apps/desktop/electron/services/document-*`
- `apps/desktop/electron/services/file-registry-*`
- `apps/desktop/electron/services/managed-directory-*`
- templates e regras admissionais MH
- serviços de geração de recibos/documentos
- `appId`, `productName`, diretório de dados e release channel da edição MH

## Compatibilidade
Rotas antigas permanecem funcionando. Hubs apenas organizam e apontam para fluxos existentes. Nenhuma alteração deve depender de correspondência de funcionário por primeiro nome; IDs e identificadores já existentes continuam sendo a referência.

## Testes e gates
Antes de merge:
- Desktop: testes, typecheck/lint e build.
- Regressões obrigatórias para IA/contexto/hubs.
- Regressões existentes de scanner/documentos devem continuar verdes.
- Verificar que migrations não são alteradas por esta entrega.
- Verificar que appId e productName permanecem MH.
- Verificar que nenhum arquivo de billing/Asaas/licenciamento comercial entrou na edição MH.

## Rollback
As mudanças devem ser separadas por commits funcionais e integradas via PR. A `main` só recebe a atualização depois dos gates de CI.
