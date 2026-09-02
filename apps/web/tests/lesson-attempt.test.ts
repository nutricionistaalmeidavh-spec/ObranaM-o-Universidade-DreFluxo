import {describe,expect,it} from 'vitest';
import {completeLessonAttempt,createLessonAttempt,freezeLessonAttempt,markAttemptResponse,rerollLessonAttempt} from '../backend/lesson-attempt';
const ids=(n:number)=>Array.from({length:n},(_,i)=>'q_'+(i+1).toString(36));
const base=()=>createLessonAttempt({id:'a1',participantId:'p1',unit:'adicao-N1',seed:123,createdAt:'2026-08-27T12:00:00.000Z',preparedBy:'learner'});
describe('LessonAttempt congelado',()=>{
 it('congela 9 questões e 3 de reforço em N1',()=>{const x=freezeLessonAttempt(base(),ids(9),['q_r1','q_r2','q_r3'],'2026-08-27T12:01:00.000Z');expect(x.questionIds).toHaveLength(9);expect(x.reinforcementQuestionIds).toHaveLength(3)});
 it('preserva a mesma composição ao congelar novamente com os mesmos IDs',()=>{const x=freezeLessonAttempt(base(),ids(9),['q_r1','q_r2','q_r3'],'2026-08-27T12:01:00.000Z');expect(freezeLessonAttempt(x,ids(9),['q_r1','q_r2','q_r3'],'2026-08-27T12:02:00.000Z').questionIds).toEqual(x.questionIds)});
 it('bloqueia reroll depois da primeira resposta',()=>{const frozen=freezeLessonAttempt(base(),ids(9),['q_r1','q_r2','q_r3'],'2026-08-27T12:01:00.000Z'),answered=markAttemptResponse(frozen,'q_1','2026-08-27T12:02:00.000Z');expect(()=>rerollLessonAttempt(answered,456,'2026-08-27T12:03:00.000Z')).toThrow(/primeira resposta/)});
 it('marca conclusão sem apagar a composição',()=>{const frozen=freezeLessonAttempt(base(),ids(9),['q_r1','q_r2','q_r3'],'2026-08-27T12:01:00.000Z'),done=completeLessonAttempt(frozen,'2026-08-27T12:10:00.000Z');expect(done.status).toBe('completed');expect(done.questionIds).toHaveLength(9)});
});
