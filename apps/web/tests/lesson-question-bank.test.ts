import { describe, expect, it } from 'vitest';
import { CONTENT, selectQuestions } from '../src/curriculum';

describe('banco de prática ampliado', () => {
  it('mantém 3 questões por padrão para compatibilidade', () => {
    expect(selectQuestions('divisao-N1', CONTENT['divisao-N1'].items, 1)).toHaveLength(3);
  });

  it('consegue fornecer 9 questões únicas mesmo em unidades antes curtas', () => {
    const items = selectQuestions('divisao-N1', CONTENT['divisao-N1'].items, 1, 9);
    expect(items).toHaveLength(9);
    expect(new Set(items.map(item => item.prompt)).size).toBe(9);
  });

  it('fornece pelo menos 13 questões para fechamentos', () => {
    const items = selectQuestions('medidas-N5', CONTENT['medidas-N5'].items, 2, 13);
    expect(items).toHaveLength(13);
  });
});
