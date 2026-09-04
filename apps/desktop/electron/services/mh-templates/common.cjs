const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]))
const dateBR = (iso) => iso ? String(iso).split('-').reverse().join('/') : '____/____/________'
const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((Number(cents) || 0) / 100)
const time = (value, fallback) => String(value || fallback).slice(0,5)
const employeeAddress = (e) => e.endereco || [e.endereco_logradouro,e.endereco_numero,e.endereco_complemento,e.endereco_bairro,e.endereco_cidade,e.endereco_uf].filter(Boolean).join(', ')
const companyName = (c) => c?.razao_social || c?.nome_fantasia || 'MH HIDRAULICA RP LTDA'
const companyAddress = (c) => c?.endereco || 'Rua Shirlei Chirieleison Lane, 100 APTO 104, Ribeirão Preto - SP'

const css = `@page{size:A4;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111;font-size:9.2pt;line-height:1.25;margin:0}h1{font-size:13pt;text-align:center;margin:0 0 10px}h2{font-size:9.5pt;text-align:center;margin:7px 0 3px;border:1px solid #222;padding:3px}p{margin:5px 0;text-align:justify}.box{border:1px solid #222;padding:5px}.grid{display:grid;grid-template-columns:1fr 1fr}.cell{border:1px solid #222;padding:3px;min-height:28px}.label{font-size:7.5pt}.value{font-weight:600}.sig{display:grid;grid-template-columns:1fr 1fr;gap:35px;margin-top:30px;text-align:center}.sig>div{border-top:1px solid #111;padding-top:4px}.page{break-after:page}.small{font-size:7.5pt}.center{text-align:center}table{width:100%;border-collapse:collapse}th,td{border:1px solid #222;padding:3px;vertical-align:top}th{font-size:7.5pt}.blank{height:42px}.check{display:inline-block;width:11px;height:11px;border:1px solid #111;text-align:center;line-height:10px}.fingerprint{height:65px;border:1px solid #222}`
const page = (title, body, extra='') => `<!doctype html><html><head><meta charset="utf-8"><style>${css}${extra}</style></head><body>${title?`<h1>${esc(title)}</h1>`:''}${body}</body></html>`

module.exports = { esc,dateBR,money,time,employeeAddress,companyName,companyAddress,page }
