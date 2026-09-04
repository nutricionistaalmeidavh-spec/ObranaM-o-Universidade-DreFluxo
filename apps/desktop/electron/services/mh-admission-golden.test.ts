import { describe, expect, it } from 'vitest'
import { renderMhAdmissionTemplate } from './mh-admission-templates.cjs'

const company:any={razao_social:'MH HIDRAULICA RP LTDA',cnpj:'50.733.669/0001-60',endereco:'Ribeirão Preto - SP'}
const employee:any={nome:'FUNCIONARIO GOLDEN',cpf:'123.456.789-01',rg:'12.345.678-9',rg_orgao:'SSP/SP',ctps:'12345',ctps_serie:'001',ctps_uf:'SP',pis:'123.45678.90-1',data_nascimento:'2000-01-01',naturalidade:'RIBEIRÃO PRETO-SP',nacionalidade:'BRASIL',estado_civil:'SOLTEIRO',pai:'PAI',mae:'MAE',admissao:'2026-09-01',salario_centavos:230296,matricula_esocial:'0050600013',jornada_inicio:'07:00',intervalo_inicio:'11:00',intervalo_fim:'12:00',jornada_fim:'17:00',experiencia_dias:45,experiencia_fim:'2026-10-15',fgts_optante:1,fgts_opcao_em:'2026-09-01',vale_transporte_opcao:1,endereco_logradouro:'Rua A',endereco_numero:'10',endereco_bairro:'Centro',endereco_cidade:'Ribeirão Preto',endereco_uf:'SP',cep:'14000-000',cbo:'724110'}
const keys=['contrato_experiencia','ficha_registro','ordem_servico','vale_transporte','ficha_epi','carta_sindical']

for(const cargo of ['Ajudante de Encanador','Encanador']) describe(`golden admission content - ${cargo}`,()=>{
  const e={...employee,cargo_nome:cargo}
  it('renders every canonical document without legacy system footer',()=>{for(const key of keys){const html=renderMhAdmissionTemplate(key,e,company,[],{nome:'OBRA GOLDEN'});expect(html.length).toBeGreaterThan(500);expect(html).toContain('FUNCIONARIO GOLDEN');expect(html).not.toContain('Documento gerado pelo Fluxo DRE')}})
  it('keeps contract pagination and signature/prorrogação sections',()=>{const html=renderMhAdmissionTemplate('contrato_experiencia',e,company);expect(html).toContain('PRORROGAÇÃO DO CONTRATO');expect(html).toContain('EMPREGADO');expect(html).toContain('EMPREGADORA');expect(html).toContain('break-after:page')})
  it('keeps registration history blocks',()=>{const html=renderMhAdmissionTemplate('ficha_registro',e,company);for(const marker of ['ALTERAÇÕES DE SALÁRIO','FÉRIAS','ACIDENTES','RESCISÃO DE CONTRATO','CONTRIBUIÇÃO SINDICAL'])expect(html).toContain(marker)})
})
