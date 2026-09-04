const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]))
const dateBR = (iso) => iso ? String(iso).split('-').reverse().join('/') : '____/____/________'
const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((Number(cents) || 0) / 100)
const cleanTime = (value, fallback) => String(value || fallback).slice(0, 5)
const fullAddress = (employee) => employee.endereco || [employee.endereco_logradouro, employee.endereco_numero, employee.endereco_complemento, employee.endereco_bairro, employee.endereco_cidade, employee.endereco_uf].filter(Boolean).join(', ')

function numberWords(n) {
  n = Math.floor(Number(n) || 0)
  if (n === 0) return 'ZERO'
  const u=['','UM','DOIS','TRÊS','QUATRO','CINCO','SEIS','SETE','OITO','NOVE','DEZ','ONZE','DOZE','TREZE','QUATORZE','QUINZE','DEZESSEIS','DEZ