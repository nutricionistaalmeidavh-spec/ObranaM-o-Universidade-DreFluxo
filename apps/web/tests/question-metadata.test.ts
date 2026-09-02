import {describe,expect,it} from 'vitest';
import {questionMetadata,questionCoverage,withQuestionMetadata} from '../src/question-metadata';

describe('metadados do banco de questões',()=>{
 it('classifica competência, nível interno, Aprendizado, tipo e uso',()=>{
  const meta=questionMetadata('adicao-N4',{kind:'short-text',prompt:'Quanto é 4 + 5?',topic:'Adição'},0);
  expect(meta.competency).toBe('adicao');
  expect(meta.internalLevel).toBe('N4');
  expect(meta.learningLabel).toBe('Aprendizado 2');
  expect(meta.responseMode).toBe('objective');
  expect(meta.diagnostic).toBe(false);
  expect(meta.uses).toContain('review');
  expect(meta.visual).toBe('mapped-candidate');
 });
 it('marca resposta aberta e competências fora do pacote visual',()=>{
  const meta=questionMetadata('direitos-N3',{kind:'text',prompt:'Explique.',topic:'Direitos'},1);
  expect(meta.responseMode).toBe('open');
  expect(meta.visual).toBe('none');
 });
 it('distribui preferência de Parte 1 e Parte 2 sem perder elegibilidade para revisão',()=>{
  const items=Array.from({length:13},(_,i)=>withQuestionMetadata('leitura-N2',{kind:'choice' as const,prompt:'Q'+i,topic:'Leitura'},i));
  const coverage=questionCoverage(items);
  expect(coverage.part1).toBeGreaterThanOrEqual(3);
  expect(coverage.part2).toBeGreaterThanOrEqual(6);
  expect(coverage.review).toBe(13);
 })
});
