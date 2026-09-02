import {describe,expect,it} from 'vitest';
import {CONTENT,QUESTION_COVERAGE,selectQuestions} from '../src/curriculum';

describe('cobertura do banco para a estrutura 3 + 6 + revisão',()=>{
 it('todas as unidades têm cobertura suficiente',()=>{
  const rows=Object.entries(QUESTION_COVERAGE);
  expect(rows).toHaveLength(60);
  expect(rows.filter(([,row])=>!row.ok)).toEqual([]);
 });
 it('seleção de 13 mantém enunciados únicos e metadados completos',()=>{
  for(const [id,unit] of Object.entries(CONTENT)){
   const items=selectQuestions(id,unit.items,12345,13);
   expect(items).toHaveLength(13);
   expect(new Set(items.map(item=>item.prompt.normalize('NFKC').trim().toLocaleLowerCase('pt-BR'))).size).toBe(13);
   expect(items.every(item=>item.meta?.competency&&item.meta?.internalLevel&&item.meta?.uses.includes('practice'))).toBe(true);
  }
 })
});
