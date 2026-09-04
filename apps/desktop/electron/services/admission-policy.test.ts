import { describe, expect, it } from 'vitest'
import { buildAdmissionPlan, validateAdmissionDocuments, admissionDocumentFilename } from './admission-policy.cjs'

const base:any={nome:'FUNCIONARIO TESTE',cpf:'12345678901',rg:'123',rg_orgao:'SSP/SP',data_nascimento:'2000-01-01',naturalidade:'RIBEIRAO PRETO-SP',nacionalidade:'BRASIL',estado_civil:'SOLTEIRO',pai:'PAI',mae:'MAE',ctps:'123',ctps_serie:'1',pis:'123',endereco_logradouro:'Rua A',endereco_numero:'10',endereco_bairro:'Centro',endereco_cidade:'Ribeirao Preto',endereco_uf:'SP',cep:'14000-000',matricula_esocial:'001',admissao:'2026-09-01',cargo_id:1,cargo_nome:'Encanador',cbo:'724110',salario_centavos:266475,jornada_inicio:'07:00',intervalo_inicio:'11:00',intervalo_fim:'12:00',jornada_fim:'17:00',experiencia_dias:45,experiencia_fim:'2026-10-15',fgts_optante:1,fgts_opcao_em:'2026-09-01',vale_transporte_opcao:1}

describe('admission policy v2',()=>{
 it('builds a single canonical plan for ajudante and encanador without duplicating templates',()=>{for(const cargo of ['Encanador','Ajudante de Encanador']){const plan=buildAdmissionPlan({...base,cargo_nome:cargo},false);expect(plan.map((x:any)=>x.key)).toEqual(['contrato_experiencia','ficha_registro','ordem_servico','vale_transporte','ficha_epi']);expect(plan.every((x:any)=>x.profile===cargo)).toBe(true)}})
 it('adds union opposition only when requested',()=>{expect(buildAdmissionPlan(base,true).at(-1)?.key).toBe('carta_sindical')})
 it('returns per-document missing fields before generation',()=>{const broken={...base,ctps:'',endereco_logradouro:''};const result=validateAdmissionDocuments(broken,['contrato_experiencia','vale_transporte']);expect(result.ok).toBe(false);expect(result.byDocument.contrato_experiencia).toContain('ctps');expect(result.byDocument.vale_transporte).toContain('endereco_logradouro')})
 it('uses stable numbered filenames',()=>{expect(admissionDocumentFilename(0,'Contrato de experiência')).toBe('01 - Contrato de experiência.pdf');expect(admissionDocumentFilename(5,'Carta de oposição sindical')).toBe('06 - Carta de oposição sindical.pdf')})
})
