const { esc,dateBR,companyName,companyAddress,page } = require('./common.cjs')
function unionLetterTemplate({employee,company}){
 const body=`<p style="text-align:right">Ribeirão Preto, ${dateBR(employee.admissao)}</p><p>Ao<br><b>Sindicato da Construção Civil de Ribeirão Preto.</b></p><p><b>Assunto: CONTRIBUIÇÃO ASSISTENCIAL / CONTRIBUIÇÃO CONFEDERATIVA</b></p><p>Eu: <b>${esc(employee.nome)}</b>, portador da carteira profissional nº ${esc(employee.ctps||'')} Série ${esc(employee.ctps_serie||'')}${employee.ctps_uf?'-'+esc(employee.ctps_uf):''}, regularmente registrado na empresa: <b>${esc(companyName(company))}</b>, CNPJ: ${esc(company?.cnpj||'')}, com sede à ${esc(companyAddress(company))}, não sindicalizado, manifesto oposição ao desconto em folha de pagamento a título de contribuição assistencial, confederativa ou outras contribuições em favor dessa entidade.</p><p>Atenciosamente,</p><div style="margin-top:55px;width:70%;border-top:1px solid #111;text-align:center">${esc(employee.nome)}</div>`
 return page('MODELO DE CARTA DE OPOSIÇÃO AO DESCONTO DAS CONTRIBUIÇÕES AO SINDICATO',body,'body{font-size:11pt;line-height:1.5}')
}
module.exports={unionLetterTemplate}
