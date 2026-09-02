import { describe, expect, it } from 'vitest';
import { evaluateObjectiveConsolidation } from '../backend/unit-policy';

describe('consolidação com quantidade variável de questões', () => {
  it('mantém compatibilidade com unidades antigas de 3 questões', () => {
    expect(evaluateObjectiveConsolidation(Array.from({ length: 3 }, () => ({ attempts: 1, errors: 0 }))).consolidated).toBe(true);
  });

  it('aceita unidades novas de 9 e 13 questões', () => {
    expect(evaluateObjectiveConsolidation(Array.from({ length: 9 }, () => ({ attempts: 1, errors: 0 })), 9).consolidated).toBe(true);
    expect(evaluateObjectiveConsolidation(Array.from({ length: 13 }, () => ({ attempts: 1, errors: 0 })), 13).consolidated).toBe(true);
  });

  it('não consolida quando faltam evidências', () => {
    expect(evaluateObjectiveConsolidation(Array.from({ length: 8 }, () => ({ attempts: 1, errors: 0 })), 9).consolidated).toBe(false);
  });
});
