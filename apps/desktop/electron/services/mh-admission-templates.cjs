const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]))
const dateBR = (iso) => iso ? String(iso).split('-').reverse().join('/') : '____/____/________'
const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((Number(cents) || 0) / 100)
const time = (value, fallback) => String(value || fallback).slice(0, 5)
const address = (e) => e.endereco || [e.endereco_logradouro, e.endereco_numero, e.endereco_complemento, e.endereco_bairro, e.endereco_cidade, e.endereco_uf].filter(Boolean).join(', ')
const companyName = (c) => c?.razao_social || c?.nome_fantasia || 'MH HIDRAULICA RP LTDA'

function under1000(n) {
  const a=['','UM','DOIS','TRÊS','QUATRO','CINCO','SEIS','SETE','OITO','NOVE','DEZ','ONZE','DOZE','TREZE','QUATORZE','QUINZE','DEZESSEIS','DEZESSETE