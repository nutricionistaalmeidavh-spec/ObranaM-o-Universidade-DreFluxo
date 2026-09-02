import {describe,expect,it} from 'vitest';
import {evidenceFromCheckpoints,updateContinuousLevel} from '../backend/continuous-leveling';
const cp=(accuracy:number,graded=3)=>[{block:'part1',graded,firstTryCorrect:Math.round(graded*accuracy/100),accuracy},{block:'part2',graded:6,firstTryCorrect:5,accuracy:83}];
describe('nivelamento contínuo',()=>{
 it('avança um nível interno após evidência forte e consolidação',()=>{const x=updateContinuousLevel({currentLevel:'N2',unitLevel:'N2',checkpoints:cp(100),consolidated:true});expect(x.level).toBe('N3');expect(x.action).toBe('advance');expect(x.confidence).toBeGreaterThanOrEqual(.6)});
 it('recua internamente apenas quando a evidência é fraca e a unidade não consolidou',()=>{const x=updateContinuousLevel({currentLevel:'N3',unitLevel:'N3',checkpoints:[{block:'part1',graded:3,firstTryCorrect:0,accuracy:0},{block:'part2',graded:6,firstTryCorrect:2,accuracy:33}],consolidated:false});expect(x.level).toBe('N2');expect(x.action).toBe('reinforce')});
 it('não pune dificuldade inicial quando houve consolidação',()=>{const x=updateContinuousLevel({currentLevel:'N3',unitLevel:'N3',checkpoints:[{block:'part1',graded:3,firstTryCorrect:0,accuracy:0},{block:'part2',graded:6,firstTryCorrect:2,accuracy:33}],consolidated:true});expect(x.level).toBe('N3');expect(x.action).toBe('hold')});
 it('ignora reforço ao calcular evidência principal',()=>{expect(evidenceFromCheckpoints([{block:'part1',graded:3,firstTryCorrect:2,accuracy:67},{block:'reinforcement',graded:3,firstTryCorrect:3,accuracy:100}]).score).toBe(67)});
});
