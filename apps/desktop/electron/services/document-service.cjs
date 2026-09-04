const fs = require('node:fs')
const path = require('node:path')
const { BrowserWindow } = require('electron')
const { PDFDocument } = require('pdf-lib')
const { sanitizeName, sha256 } = require('./file-service.cjs')
const { ADMISSION_DOCUMENTS } = require('./admission-documents.cjs')
const { renderMhAdmissionTemplate } = require('./mh-admission-templates.cjs')
const { buildAdmissionPlan, validateAdmissionDocuments, admissionDocumentFilename } = require('./admission-policy.cjs')

const DOCS = ADMISSION_DOCUMENTS
const RELEASE_NAME = 'MH Admission Docs v2'
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]))
const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((Number(cents) || 0) / 100)
const dateBR = (iso) => iso ? String(iso).split('-').reverse().join('/') : '____/____/________'

function base(title, employee, company, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;color:#111;font-size:10pt}h1{text-align:center;font-size:15pt}table{width:100%;border-collapse:collapse}td,th{border:1px solid #777;padding:5px}</style></head><body><h1>${esc(title)}</h1>${body}</body></html>`
}
function template(key, employee, company, epis = [], work = null) { return renderMhAdmissionTemplate(key, employee, company, epis, work) }
function customValues(employee, company) {
  return { nome_funcionario:employee.nome||'',cpf:employee.cpf||'',rg:employee.rg||'',rg_emissao:dateBR(employee.rg_emissao),rg_orgao:employee.rg_orgao||'',ctps:employee.ctps||'',ctps_serie:employee.ctps_serie||'',ctps_uf:employee.ctps_uf||'',ctps_expedicao:dateBR(employee.ctps_expedicao),pis:employee.pis||'',cargo:employee.cargo_nome||'',cbo:employee.cbo||'',admissao:dateBR(employee.admissao),salario:money(employee.salario_centavos),matricula_esocial:employee.matricula_esocial||employee.matricula||'',fgts_opcao_em:dateBR(employee.fgts_opcao_em),endereco_funcionario:employee.endereco||'',endereco_logradouro:employee.endereco_logradouro||'',endereco_numero:employee.endereco_numero||'',endereco_complemento:employee.endereco_complemento||'',endereco_bairro:employee.endereco_bairro||'',endereco_cidade:employee.endereco_cidade||'',endereco_uf:employee.endereco_uf||'',cep:employee.cep||'',empresa:company?.razao_social||company?.nome_fantasia||'',cnpj:company?.cnpj||'',endereco_empresa:company?.endereco||'',data_hoje:dateBR(new Date().toISOString().slice(0,10)) }
}
function sanitizeTemplateHtml(content) { return String(content||'').replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,'').replace(/<\/?(?:iframe|object|embed|base)\b[^>]*>/gi,'').replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,'') }
function renderCustom(content, employee, company, title) {
  const values=customValues(employee,company), manual=(label)=>`<span style="border:1px dashed #8a6500;background:#fff7c7;padding:2px 5px">PREENCHER: ${esc(label)}</span>`
  const replaced=sanitizeTemplateHtml(content).replace(/\{\{manual:([^}]+)\}\}/gi,(_,label)=>manual(String(label).trim()||'campo')).replace(/\{\{([a-z_]+)\}\}/gi,(_,key)=>values[key.toLowerCase()]?esc(values[key.toLowerCase()]):manual(key.replaceAll('_',' ')))
  return /<html/i.test(replaced)?replaced:base(title,employee,company,replaced)
}
function readLocalTemplate(filePath) {
  const resolved=path.resolve(String(filePath||'')), extension=path.extname(resolved).toLowerCase()
  if(!['.html','.htm','.txt'].includes(extension)) throw new Error('Escolha um modelo HTML, HTM ou TXT.')
  const stat=fs.statSync(resolved); if(!stat.isFile()||stat.size>2*1024*1024) throw new Error('O modelo deve ser um arquivo de até 2 MB.')
  const source=fs.readFileSync(resolved,'utf8'); if(!source.trim()) throw new Error('O arquivo de modelo está vazio.')
  return {nome:path.basename(resolved,extension),conteudo_html:extension==='.txt'?`<pre>${esc(source)}</pre>`:sanitizeTemplateHtml(source),arquivo_origem:resolved}
}
function admissionFolders(fileService, employee, companyName) {
  const identity = sanitizeName(employee.cpf || employee.id)
  const date = sanitizeName(employee.admissao || new Date().toISOString().slice(0,10))
  const base = path.join(fileService.documentsDir, sanitizeName(companyName || 'Empresa'), 'Funcionários', identity, sanitizeName(employee.nome), 'Admissão', date)
  const folders = { base, unsigned:path.join(base,'Não assinados'), signed:path.join(base,'Assinados'), general:path.join(base,'Documentação Geral') }
  for (const folder of Object.values(folders)) fs.mkdirSync(folder,{recursive:true})
  return folders
}

class DocumentService {
  constructor({db,fileService,dialog}){this.db=db;this.fileService=fileService;this.dialog=dialog}
  async printHtml(html,destination){const win=new BrowserWindow({show:false,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false}});try{await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);const pdf=await win.webContents.printToPDF({pageSize:'A4',printBackground:true,margins:{marginType:'none'}});fs.writeFileSync(destination,pdf)}finally{win.destroy()}}
  getReleaseState(){const row=this.db.db.prepare("SELECT valor FROM configuracoes WHERE chave='mh_admission_docs_release'").get();return {name:RELEASE_NAME,state:row?.valor||'candidate',rollback:'Modelos personalizados anteriores permanecem disponíveis na tela de modelos.'}}
  listTemplates(){const selected=new Map(this.db.db.prepare("SELECT chave, valor FROM configuracoes WHERE chave LIKE 'modelo_rh:%'").all().map(row=>[row.chave.replace('modelo_rh:',''),row.valor]));const custom=this.db.list('modelos_documento_rh').filter(item=>DOCS.some(doc=>doc.key===item.chave)).map(item=>({...item,origem:'personalizado',selecionado:String(selected.get(item.chave)||'')===String(item.id)}));const defaults=DOCS.map(doc=>({id:`padrao:${doc.key}`,chave:doc.key,nome:`${doc.title} (padrão MH v2)`,ativo:1,origem:'padrao',selecionado:!selected.get(doc.key)||selected.get(doc.key)===`padrao:${doc.key}`,campos:Object.keys(customValues({},{}))}));return [...defaults,...custom]}
  saveTemplate(data){if(!DOCS.some(doc=>doc.key===data.chave)) throw new Error('Modelo de documento inválido.');if(!String(data.nome||'').trim()||!String(data.conteudo_html||'').trim()) throw new Error('Informe nome e conteúdo do modelo.');return this.db.save('modelos_documento_rh',{...data,nome:String(data.nome).trim(),conteudo_html:String(data.conteudo_html),ativo:data.ativo===false?0:1})}
  async chooseLocalTemplate(){if(!this.dialog) throw new Error('Seleção de arquivos indisponível.');const result=await this.dialog.showOpenDialog({title:'Selecionar modelo local',properties:['openFile'],filters:[{name:'Modelos HTML',extensions:['html','htm','txt']}]});if(result.canceled||!result.filePaths[0])return null;return readLocalTemplate(result.filePaths[0])}
  setDefaultTemplate({chave,modelo_id}){if(!DOCS.some(doc=>doc.key===chave)) throw new Error('Tipo de documento inválido.');if(!String(modelo_id).startsWith('padrao:')){const custom=this.db.get('modelos_documento_rh',Number(modelo_id));if(!custom||custom.chave!==chave||!custom.ativo) throw new Error('Selecione um modelo ativo compatível com o documento.')}this.db.db.prepare("INSERT INTO configuracoes(chave,valor,updated_at) VALUES (?,?,CURRENT_TIMESTAMP) ON CONFLICT(chave) DO UPDATE SET valor=excluded.valor,updated_at=CURRENT_TIMESTAMP").run(`modelo_rh:${chave}`,String(modelo_id));return true}
  latestEsocial(employeeId){const row=this.db.db.prepare("SELECT d.*,a.caminho FROM documentos d JOIN arquivos a ON a.id=d.arquivo_id WHERE d.funcionario_id=? AND lower(d.categoria)='esocial' AND d.deleted_at IS NULL ORDER BY d.id DESC LIMIT 1").get(employeeId);return row&&row.caminho&&path.extname(row.caminho).toLowerCase()==='.pdf'&&fs.existsSync(row.caminho)?row:null}
  employeeEpis(employeeId, cargoId) {
    const rows=this.db.db.prepare('SELECT fe.*,e.nome,e.ca FROM funcionario_epis fe JOIN epis e ON e.id=fe.epi_id WHERE fe.funcionario_id=? AND fe.id IN (SELECT MAX(id) FROM funcionario_epis WHERE funcionario_id=? GROUP BY epi_id) ORDER BY fe.data_entrega,e.id').all(employeeId,employeeId)
    const kitRows=cargoId?this.db.db.prepare('SELECT epi_id,quantidade_texto FROM cargo_epi_kits WHERE cargo_id=? AND ativo=1').all(cargoId):[]
    const quantities=new Map(kitRows.map(item=>[Number(item.epi_id),item.quantidade_texto]))
    return rows.map(item=>({...item,quantidade:quantities.get(Number(item.epi_id))??item.quantidade}))
  }
  saveGeneratedFile(destination, filename, employee, doc, html, selectedModel) {
    const stat=fs.statSync(destination), existingFile=this.db.db.prepare('SELECT * FROM arquivos WHERE caminho=?').get(destination)
    const file=this.db.save('arquivos',{...(existingFile||{}),nome_original:filename,nome_armazenado:filename,caminho:destination,tamanho:stat.size,extensao:'.pdf',mime_type:'application/pdf',hash:sha256(destination),origem:'gerado'})
    const existingDoc=this.db.db.prepare('SELECT * FROM documentos WHERE funcionario_id=? AND categoria=? AND arquivo_id=? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1').get(employee.id,doc.key,file.id)
    const record=this.db.save('documentos',{...(existingDoc||{}),arquivo_id:file.id,empresa_id:employee.empresa_id,obra_id:employee.obra_atual_id,funcionario_id:employee.id,categoria:doc.key,titulo:doc.title,status_assinatura:'nao_assinado',versao:(existingDoc?.versao||0)+1,observacoes:selectedModel?`Modelo personalizado: ${selectedModel.nome}`:`${RELEASE_NAME} · modelo oficial MH`})
    const editable=this.db.db.prepare('SELECT * FROM documentos_editaveis WHERE documento_id=? ORDER BY id DESC LIMIT 1').get(record.id)
    this.db.save('documentos_editaveis',{...(editable||{}),documento_id:record.id,conteudo_html:html,revisao:(editable?.revisao||0)+1})
    return {...record,path:destination}
  }
  async generate({funcionario_id,includeCarta=false,selected=[],modelos={}}){
    const employee=this.db.get('funcionarios',funcionario_id);if(!employee)throw new Error('Funcionário não encontrado.')
    const company=employee.empresa_id?this.db.get('empresas',employee.empresa_id):null,cargo=employee.cargo_id?this.db.get('cargos',employee.cargo_id):null,work=employee.obra_atual_id?this.db.get('obras',employee.obra_atual_id):null
    employee.cargo_nome=cargo?.nome;employee.cbo=cargo?.cbo
    const plan=buildAdmissionPlan(employee,includeCarta).filter(doc=>!selected.length||selected.includes(doc.key))
    const validation=validateAdmissionDocuments(employee,plan.map(doc=>doc.key))
    if(!validation.ok){const details=Object.entries(validation.byDocument).map(([key,fields])=>`${key}: ${fields.join(', ')}`).join(' | ');const error=new Error(`Existem campos obrigatórios pendentes antes de gerar os documentos: ${details}`);error.details=validation.byDocument;throw error}
    const epis=this.employeeEpis(employee.id,cargo?.id)
    const folders=admissionFolders(this.fileService,employee,company?.nome_fantasia||company?.razao_social),generated=[]
    for(let index=0;index<plan.length;index++){
      const doc=plan[index],preference=this.db.db.prepare('SELECT valor FROM configuracoes WHERE chave=?').get(`modelo_rh:${doc.key}`),selectedModelId=modelos[doc.key]||preference?.valor||`padrao:${doc.key}`,selectedModel=selectedModelId&&!String(selectedModelId).startsWith('padrao:')?this.db.get('modelos_documento_rh',Number(selectedModelId)):null
      if(selectedModel&&!selectedModel.ativo)throw new Error(`O modelo selecionado para ${doc.title} está inativo.`)
      const filename=admissionDocumentFilename(index,doc.title),destination=path.join(folders.unsigned,filename),html=selectedModel?renderCustom(selectedModel.conteudo_html,employee,company,doc.title):template(doc.key,employee,company,epis,work)
      await this.printHtml(html,destination);generated.push(this.saveGeneratedFile(destination,filename,employee,doc,html,selectedModel))
    }
    const dossier=await PDFDocument.create();for(const doc of generated){const source=await PDFDocument.load(fs.readFileSync(doc.path));const pages=await dossier.copyPages(source,source.getPageIndices());pages.forEach(page=>dossier.addPage(page))}
    const esocial=this.latestEsocial(employee.id);let esocialCopy=null
    if(esocial){const extension='.pdf',number=String(generated.length+1).padStart(2,'0'),copyName=`${number} - eSocial oficial${extension}`;esocialCopy=path.join(folders.unsigned,copyName);fs.copyFileSync(esocial.caminho,esocialCopy);const source=await PDFDocument.load(fs.readFileSync(esocial.caminho));const pages=await dossier.copyPages(source,source.getPageIndices());pages.forEach(page=>dossier.addPage(page))}
    const dossierName='00_Dossie_Admissao.pdf',dossierPath=path.join(folders.base,dossierName);fs.writeFileSync(dossierPath,await dossier.save())
    return {generated,dossier:dossierPath,folders,esocial:esocial?{id:esocial.id,path:esocial.caminho,copy:esocialCopy}:null,release:this.getReleaseState(),validation}
  }
}
module.exports={DocumentService,DOCS,template,readLocalTemplate,renderCustom,admissionFolders,RELEASE_NAME}
