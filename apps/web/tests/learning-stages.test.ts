import {describe,expect,it} from 'vitest';
import {LEARNING_STAGES,completedLevelsForSkill,learningStageForLevel,learningStageProgress,learningStageTargetLevel} from '../src/learning-stages';

describe('Aprendizados visíveis sobre a progressão interna',()=>{
  it('agrupa N1-N5 em três Aprendizados sem alterar os níveis internos',()=>{
    expect(learningStageForLevel('N1').label).toBe('Aprendizado 1');
    expect(learningStageForLevel('N2').label).toBe('Aprendizado 1');
    expect(learningStageForLevel('N3').label).toBe('Aprendizado 2');
    expect(learningStageForLevel('N4').label).toBe('Aprendizado 2');
    expect(learningStageForLevel('N5').label).toBe('Aprendizado 3');
  });
  it('interpreta progresso legado sem migrar registros',()=>{
    const completed=completedLevelsForSkill(['adicao-N1','adicao-N2','leitura-N1'],'adicao');
    expect(completed).toEqual(['N1','N2']);
    expect(learningStageProgress(LEARNING_STAGES[0],completed)).toBe(100);
    expect(learningStageProgress(LEARNING_STAGES[1],['N3'])).toBe(50);
    expect(learningStageProgress(LEARNING_STAGES[2],['N5'])).toBe(100);
  });
  it('usa o nível recomendado como ponto de entrada quando pertence ao Aprendizado',()=>{
    expect(learningStageTargetLevel(LEARNING_STAGES[0],[],'N2')).toBe('N2');
    expect(learningStageTargetLevel(LEARNING_STAGES[1],[],'N4')).toBe('N4');
    expect(learningStageTargetLevel(LEARNING_STAGES[0],['N1','N2'],'N2')).toBe('N2');
  });
});
