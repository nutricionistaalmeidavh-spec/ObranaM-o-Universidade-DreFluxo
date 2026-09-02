# FluxoDRE Campo — Motor de Produção Real

## Objetivo
Transformar o apontamento diário em fonte de verdade para produtividade, mantendo separados planejamento, execução e avanço físico.

## Regras aprovadas
- Novo apontamento sugere 07:30 como horário de início.
- O horário pode ser corrigido manualmente depois; a sessão registra que houve correção.
- Uma sessão pertence a uma data, serviço e pavimento.
- Estados da sessão: em execução, pausada e concluída.
- Ações: Iniciar, Pausar, Retomar, Concluir, Editar horários e Atualizar equipe.
- A equipe é fotografada logicamente no início a partir dos funcionários vinculados à frente; o usuário pode ajustar os participantes.
- Alterações de equipe durante a sessão entram em um histórico próprio e não reescrevem a equipe anterior.
- Concluir uma sessão exige informar o resultado físico: continua em execução, verificação, concluído, bloqueado ou sem avanço relevante.
- Tempo trabalhado não implica avanço físico automático.
- Resultado físico atualiza o status da etapa, exceto “sem avanço relevante”, que preserva o status existente.
- Concluir a etapa libera os funcionários ainda vinculados àquela frente para remanejamento.
- Sessões guardam segmentos de tempo para representar pausas e retomadas.
- Produtividade usa minutos produtivos e homem-hora; mudanças de equipe são consideradas no cálculo.
- Dados existentes do IndexedDB são migrados sem reset.

## Dados
`days[date].sessions[]` contém: id, date, service, floor, state, segments, crewEvents, result, note, corrected, createdAt e updatedAt.

`segments[]`: `{ start: 'HH:MM', end: 'HH:MM' | null }`.

`crewEvents[]`: `{ time: 'HH:MM', employeeIds: string[] }`.

`settings.defaultWorkStart = '07:30'`.

## UI
A tela de dia mantém Planejamento e passa a exibir Apontamentos de produção antes do registro legado. O usuário pode criar sessão, controlar execução, editar horários e equipe e fechar a sessão.

Planejamento mostra um resumo de produtividade real por serviço com sessões concluídas, horas produtivas, homem-hora e ciclo observado quando houver conclusões físicas suficientes.

Configurações expõe o horário padrão de início, além do editor de checklists já existente.

## Persistência e compatibilidade
A migração v4→v5 adiciona `sessions` a todos os dias, `defaultWorkStart` às configurações e preserva `assignments`, `plans`, `events`, checklists, funcionários, pavimentos, pendências e histórico.

## Validação
- Não criar sessão sem ao menos um funcionário.
- Não concluir uma sessão em execução sem horário de fim válido.
- Horários devem manter ordem cronológica dentro do mesmo dia.
- Pausar fecha o segmento aberto; retomar cria novo segmento.
- Edição manual pode alterar segmentos, mas marca `corrected=true`.