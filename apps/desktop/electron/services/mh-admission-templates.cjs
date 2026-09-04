const { contractTemplate } = require('./mh-templates/contract.cjs')
const { registrationTemplate } = require('./mh-templates/registration.cjs')
const { serviceOrderTemplate } = require('./mh-templates/service-order.cjs')
const { transitTemplate } = require('./mh-templates/transit.cjs')
const { epiTemplate } = require('./mh-templates/epi.cjs')
const { unionLetterTemplate } = require('./mh-templates/union-letter.cjs')

const templates = {
  contrato_experiencia: contractTemplate,
  ficha_registro: registrationTemplate,
  ordem_servico: serviceOrderTemplate,
  vale_transporte: transitTemplate,
  ficha_epi: epiTemplate,
  carta_sindical: unionLetterTemplate
}

function renderMhAdmissionTemplate(key, employee, company, epis = [], work = null) {
  const fn = templates[key]
  if (!fn) throw new Error(`Modelo MH não encontrado: ${key}`)
  return fn({ employee, company, epis, work })
}

module.exports = { renderMhAdmissionTemplate }
