const fs = require('node:fs')
const path = require('node:path')
const { app, BrowserWindow } = require('electron')
const { PDFDocument } = require('pdf-lib')
const { renderMhAdmissionTemplate } = require('../services/mh-admission-templates.cjs')

const DOCS = [
  ['contrato_experiencia','Contrato de experiencia'],
  ['ficha_registro','Ficha de registro'],
  ['ordem_servico','Ordem de servico'],
  ['vale_transporte','Vale-transporte'],
  ['ficha_epi','Ficha de EPI'],
  ['carta_sindical','Carta de oposicao sindical']
]

const company = {
  razao_social: 'MH HIDRAULICA RP LTDA',
  nome_fantasia: 'MH HIDRAULICA',
  cnpj: '50.733.669/0001-60',
  endereco: 'Ribeirao Preto - SP'
}

function employee(role, cbo, salary, cpf) {
  return {
    nome: `FUNCIONARIO TESTE ${role.toUpperCase()}`,
    cpf,
    rg: '11.111.111-1', rg_emissao: '2020-01-10', rg_orgao: 'SSP/SP',
    data_nascimento: '1995-05-20', naturalidade: 'Ribeirao Preto - SP', nacionalidade: 'Brasileira', estado_civil: 'Solteiro', sexo: 'Masculino', cor: 'Parda', escolaridade: 'Ensino medio',
    pai: 'PAI TESTE', mae: 'MAE TESTE',
    ctps: '1234567', ctps_serie: '0001', ctps_uf: 'SP', ctps_expedicao: '2018-01-01', pis: '123.45678.90-1',
    titulo_eleitor: '123456789012', titulo_eleitor_zona: '001', titulo_eleitor_secao: '002', certificado_reservista: '123456', reservista_categoria: '1',
    endereco_logradouro: 'Rua Teste', endereco_numero: '100', endereco_complemento: 'Casa', endereco_bairro: 'Centro', endereco_cidade: 'Ribeirao Preto', endereco_uf: 'SP', cep: '14000-000',
    matricula: 'TESTE-001', matricula_esocial: '0050600013', admissao: '2026-09-01', cargo_id: 1, cargo_nome: role, cbo,
    salario_centavos: salary, jornada_inicio: '07:00', intervalo_inicio: '11:00', intervalo_fim: '12:00', jornada_fim: '17:00', experiencia_dias: 45, experiencia_fim: '2026-10-15',
    fgts_optante: 1, fgts_opcao_em: '2026-09-01', vale_transporte_opcao: 1, vale_transporte_detalhes: 'Residencia - Trabalho - Residencia'
  }
}

const samples = [
  ['ajudante', employee('Ajudante de Encanador','724110',230296,'11111111111')],
  ['encanador', employee('Encanador','724110',266475,'22222222222')]
]

async function printHtml(html, destination) {
  const win = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } })
  try {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    const pdf = await win.webContents.printToPDF({ pageSize: 'A4', printBackground: true, margins: { marginType: 'none' } })
    fs.writeFileSync(destination, pdf)
  } finally { win.destroy() }
}

async function renderSample(slug, employeeData, root) {
  const dir = path.join(root, slug)
  fs.mkdirSync(dir, { recursive: true })
  const dossier = await PDFDocument.create()
  for (let i = 0; i < DOCS.length; i++) {
    const [key, title] = DOCS[i]
    const html = renderMhAdmissionTemplate(key, employeeData, company, [], { nome: 'OBRA TESTE' })
    const file = path.join(dir, `${String(i + 1).padStart(2,'0')} - ${title}.pdf`)
    await printHtml(html, file)
    const source = await PDFDocument.load(fs.readFileSync(file))
    const pages = await dossier.copyPages(source, source.getPageIndices())
    pages.forEach(page => dossier.addPage(page))
  }
  fs.writeFileSync(path.join(dir, '00_Dossie_Admissao.pdf'), await dossier.save())
}

app.whenReady().then(async () => {
  const output = path.resolve(process.cwd(), 'release', 'rh-docs-fixtures')
  fs.rmSync(output, { recursive: true, force: true })
  fs.mkdirSync(output, { recursive: true })
  try {
    for (const [slug, data] of samples) await renderSample(slug, data, output)
    console.log(`RH admission fixtures generated at ${output}`)
    app.exit(0)
  } catch (error) {
    console.error(error)
    app.exit(1)
  }
})
