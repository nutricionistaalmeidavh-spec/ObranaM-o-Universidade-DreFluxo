import {describe,expect,it} from 'vitest';
import {DIAGNOSTIC_MAX_COUNT,DIAGNOSTIC_PRIMARY_COUNT,applyLoadedDiagnosticDraft,diagnosticAssignments,diagnosticDraftPayload,diagnosticInitialState,diagnosticIsComplete,recordDiagnosticResponse,selectDiagnosticConfirmations} from '../src/diagnostic-flow';
import {PRIMARY_DIAGNOSTIC_ITEMS} from '../src/diagnostic-bank';

const answerAll=(mode:'correct'|'wrong'|'mixed')=>{let state=diagnosticInitialState();for(let i=0;i<PRIMARY_DIAGNOSTIC_ITEMS.length;i++){const item=PRIMARY_DIAGNOSTIC_ITEMS[i],correct=mode==='correct'||(mode==='mixed'&&i%2===0),value=correct?(item.kind==='choice'?String(item.answer):item.id==='diag-com-03'?'Faltou material para continuar o serviço.':'Reunião amanhã às 8h.'):'resposta incorreta';state=recordDiagnosticResponse(state,value)}return state};

describe('Sondagem rápida V2',()=>{
  it('usa 15 questões principais e nunca passa de 18',()=>{
    expect(DIAGNOSTIC_PRIMARY_COUNT).toBe(15);
    expect(DIAGNOSTIC_MAX_COUNT).toBe(18);
    const mixed=answerAll('mixed');
    expect(mixed.confirmationIds.length).toBeLessThanOrEqual(3);
    expect(15+mixed.confirmationIds.length).toBeLessThanOrEqual(18);
  });
  it('termina em 15 quando a evidência é consistente',()=>{
    const state=answerAll('correct');
    expect(state.confirmationIds).toEqual([]);
    expect(diagnosticIsComplete(state)).toBe(true);
    expect(Object.keys(diagnosticAssignments(state))).toHaveLength(12);
  });
  it('pede confirmações apenas quando a área tem desempenho misto',()=>{
    const state=answerAll('mixed');
    expect(selectDiagnosticConfirmations(state.responses).length).toBeGreaterThan(0);
    expect(state.confirmationIds.length).toBeGreaterThan(0);
    expect(diagnosticIsComplete(state)).toBe(false);
  });
  it('salva e restaura o novo rascunho sem expor os níveis internos na estrutura de UI',()=>{
    const state=answerAll('wrong');
    const payload=diagnosticDraftPayload(state);
    expect(payload?.version).toBe(2);
    const loaded=applyLoadedDiagnosticDraft(diagnosticInitialState(),{...payload,updatedAt:'2026-08-27T12:00:00.000Z'});
    expect(loaded.questionIndex).toBe(state.questionIndex);
    expect(loaded.responses).toEqual(state.responses);
  });
  it('reinicia com segurança um rascunho legado V1',()=>{
    const loaded=applyLoadedDiagnosticDraft(diagnosticInitialState(),{version:1,skillIndex:4,level:3,assigned:{leitura:'level:N2'},updatedAt:'2026-08-27T12:00:00.000Z'});
    expect(loaded).toEqual(diagnosticInitialState());
  });
});
