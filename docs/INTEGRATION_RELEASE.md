# Fechamento da integração

As quatro etapas finais adicionaram a camada comum entre Web e Desktop sem
substituir os aplicativos existentes:

- adaptador de sessão e autorização;
- fila local para sincronização offline;
- teste de contrato executado pelo workspace Web;
- contratos e políticas documentados para evolução do backend.

Antes do primeiro deploy integrado, ainda é necessário executar o pipeline em
Node 20 no GitHub e validar o build nativo do Desktop com Windows SDK.
