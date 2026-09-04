const { esc,dateBR,employeeAddress,companyName,companyAddress,page } = require('./common.cjs')
function transitTemplate({employee,company}){
 const rows=(label)=>Array.from({length:6},(_,i)=>`<tr><td>${label} ${i+1}</td><td></td><td></td></tr>`).join('')
 const opt=Number(employee.vale_transporte_opcao)!==0
 const body=`<table><tr><td><b>Nome Empregado:</b> ${esc(employee.nome)}</td><td><b>Nº Reg.:</b> ${esc(employee.matricula||employee.matricula_esocial||'')}</td><td><b>CPF:</b> ${esc(employee.cpf||'')}</td></tr><tr><td><b>Função:</b> ${esc(employee.cargo_nome||'')}</td><td><b>CTPS Nº:</b> ${esc(employee.ctps||'')}</td><td><b>Série:</b> ${esc(employee.ctps_serie||'')}${employee.ctps_uf?'-'+esc(employee.ctps_uf):''}</td></tr></table>
 <p><b>À Empresa:</b> ${esc(companyName(company))}<br><b>Endereço:</b> ${esc(companyAddress(company))}</p><p><span class="check">${opt?'X':''}</span> Opto pela utilização do Vale-Transporte &nbsp;&nbsp; <span class="check">${!opt?'X':''}</span> Não opto pela utilização do Vale-Transporte</p>
 <p>Nos termos do artigo 112 do Decreto nº 10.854, de 10 de novembro de 2021, solicito receber o Vale-Transporte e comprometo-me a utilizá-lo exclusivamente para meu efetivo deslocamento residência-trabalho e vice-versa; renovar as informações sempre que houver alteração; autorizo o desconto legal aplicável ao custeio do benefício; e declaro estar ciente de que declaração falsa ou uso indevido constitui falta grave.</p>
 <h2>MINHA RESIDÊNCIA ATUAL</h2><p>${esc(employeeAddress(employee))} &nbsp; CEP: ${esc(employee.cep||'')}</p><h2>MEIO DE TRANSPORTE</h2><table><tr><th>Trecho</th><th>Empresa transportadora</th><th>Tarifa R$</th></tr>${rows('RESIDÊNCIA/TRABALHO')}${rows('TRABALHO/RESIDÊNCIA')}</table>
 <p class="center">Ribeirão Preto, ${dateBR(employee.admissao)}</p><div class="sig"><div>Assinatura do empregado<br>${esc(employee.nome)}</div><div>Responsável / testemunhas</div></div><table style="margin-top:18px"><tr><th>1 - Nome</th><th>2 - Nome</th><th>Impressão Digital</th></tr><tr><td class="blank">R.G. e Órgão Emissor<br><br>Assinatura</td><td>R.G. e Órgão Emissor<br><br>Assinatura</td><td class="fingerprint"></td></tr></table>`
 return page('SOLICITAÇÃO DO VALE - TRANSPORTE',body,'body{font-size:8.7pt}td{height:22px}')
}
module.exports={transitTemplate}
