import {describe,expect,it} from 'vitest';
import {checkpointEvidence,checkpointLabel,selectReinforcementQuestions,shouldReinforce} from '../src/lesson-adaptation';

describe('adaptação durante a aula',()=>{
 it('ativa reforço quando há dificuldade nas três primeiras questões',()=>{expect(shouldReinforce(checkpointEvidence('part1',[false,false,true]))).toBe(true);expect(shouldReinforce(checkpointEvidence('part1',[true,true,false]))).toBe(false)});
 it('não transforma resposta aberta em erro automático',()=>{const x=checkpointEvidence('part1',[true,null,false]);expect(x.graded).toBe(2);expect(x.attempted).toBe(3)});
 it('seleciona reforço objetivo sem repetir questões centrais',()=>{const core=[{kind:'choice' as const,prompt:'A'}],candidates=[{kind:'choice' as const,prompt:'A'},{kind:'text' as const,prompt:'B'},{kind:'short-text' as const,prompt:'C'},{kind:'choice' as const,prompt:'D'},{kind:'choice' as const,prompt:'E'}];expect(selectReinforcementQuestions(core,candidates,3).map(x=>x.prompt)).toEqual(['C','D','E'])});
 it('gera mensagem de checkpoint coerente',()=>{expect(checkpointLabel(checkpointEvidence('part2',[true,true,true,true,false,true])).title).toBe('Boa base para continuar')});
});
