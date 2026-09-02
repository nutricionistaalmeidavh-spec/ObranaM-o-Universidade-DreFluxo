import {describe,expect,it} from 'vitest';
import {evaluateObjectiveConsolidation} from '../backend/unit-policy';
describe('consolidação após aprendizagem adaptativa',()=>{
 it('considera dominada uma questão corrigida depois de um erro',()=>{expect(evaluateObjectiveConsolidation([{attempts:2,errors:1}],1).consolidated).toBe(true)});
 it('não considera dominada quando ainda não houve acerto',()=>{expect(evaluateObjectiveConsolidation([{attempts:2,errors:2}],1).consolidated).toBe(false)});
});
