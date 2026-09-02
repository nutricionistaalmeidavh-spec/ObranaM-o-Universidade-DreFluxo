import {describe,expect,it} from 'vitest';
import {buildLessonComposition} from '../src/lesson-composition';
describe('composição determinística da aula',()=>{
 it('repete exatamente a composição com o mesmo seed',()=>{const a=buildLessonComposition('adicao-N2',123456),b=buildLessonComposition('adicao-N2',123456);expect(a.questionIds).toEqual(b.questionIds);expect(a.reinforcementQuestionIds).toEqual(b.reinforcementQuestionIds);expect(a.questionIds).toHaveLength(13)});
 it('mantém 9 questões em unidade sem fechamento',()=>{expect(buildLessonComposition('leitura-N1',99).questionIds).toHaveLength(9)});
 it('não repete IDs entre aula central e reforço',()=>{const x=buildLessonComposition('divisao-N4',909);expect(new Set([...x.questionIds,...x.reinforcementQuestionIds]).size).toBe(16)});
});
