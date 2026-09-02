import {describe,expect,it} from 'vitest';
import {buildTeachingSequence} from '../src/lesson-teaching';
const base={objective:'Resolver uma situação de rotina.',context:'Contexto curto de trabalho.',material:'Material longo opcional.'};
describe('conteúdo obrigatório curto da aula',()=>{
 it('cria Parte 1 e Parte 2 diferentes e contextualizadas',()=>{const x=buildTeachingSequence('adicao-N2',base);expect(x.part1.body).not.toBe(x.part2.body);expect(x.part1.example).toContain('18');expect(x.part2.body).toContain(base.objective)});
 it('gera reforço alternativo sem repetir literalmente a Parte 1',()=>{const x=buildTeachingSequence('leitura-N1',base);expect(x.reinforcement.body).not.toBe(x.part1.body);expect(x.reinforcement.eyebrow).toBe('REFORÇO RÁPIDO')});
 it('mantém textos curtos para leitura em celular',()=>{for(const id of ['leitura-N1','compreensao-N3','escrita-N4','adicao-N2','divisao-N5','tecnologia-N3']){const x=buildTeachingSequence(id,base);expect(x.part1.body.split(/\s+/).length).toBeLessThan(170);expect(x.part2.body.split(/\s+/).length).toBeLessThan(170)}})
});
