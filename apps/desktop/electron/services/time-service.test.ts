import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { afterEach, describe, expect, it } from 'vitest'

const require=createRequire(import.meta.url)
const {PDFDocument}=require('pdf-lib')
const {DatabaseService}=require('./database.cjs')
const {TimeService,mergeGeneratedPdfs,normalizeMhBenefits,buildPrintBatchHtml}=require('./time-service.cjs')
const {parseEmployeeIdentity}=require('./import-service.cjs')
const created:Array<{dir:string,db:any}>=[]

function setup(){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fluxo-ponto-'))
  const db=new DatabaseService({dataDir:dir,migrationsDir:path.resolve(import.meta.dirname,'../../database/migrations')})
  db.open();created.push({dir,db})
  const company=db.save('empresas',{razao_social:'Empresa Teste LTDA',cnpj:'50.733.669/0001-60',status:'ativa'})
  const cargo=db.save('cargos',{nome:'Cargo Teste Mensal',salario_base_centavos:250000,ativo:1})
  const employee=db.save('funcionarios',{
    empresa_id:company.id,
    cargo_id:cargo.id,
    nome:'Pessoa Teste Completa',
    cpf:'123.456.789-01',
    status:'ativo',
    jornada_inicio:'07:00',
    intervalo_inicio:'11:00',
    intervalo_fim:'12:00',
    jornada_fim:'17:00'
  })
  const base=path.join(dir,'docs','Pessoa Teste Completa - 12345678901')
  const fileService={employeeFolders:()=>({base})}
  const time=new TimeService({db,fileService})
  return {dir,db,company,cargo,employee,base,time}
}

async function onePagePdf(destination:string,width:number){
  const pdf=await PDFDocument.create();pdf.addPage([width,300]);fs.writeFileSync(destination,await pdf.save())
}

afterEach(()=>{for(const item of created.splice(0)){item.db.close();fs.rmSync(item.dir,{recursive:true,force:true})}})

describe('folha de ponto mensal',()=>{
  it('preenche todos os dias com variações estáveis e preserva fins de semana',()=>{
    const {employee,time}=setup()
    const first=time.autoFill({funcionario_id:employee.id,competencia:'2026-08'})
    const second=time.autoFill({funcionario_id:employee.id,competencia:'2026-08'})
    expect(first.marks).toHaveLength(31)
    expect(second.marks.map((x:any)=>x.entrada)).toEqual(first.marks.map((x:any)=>x.entrada))
    expect(first.marks.filter((x:any)=>x.tipo==='trabalho').every((x:any)=>x.entrada!=='07:00'&&x.intervalo_saida!=='11:00'&&x.intervalo_entrada!=='12:00'&&x.saida!=='17:00')).toBe(true)
    expect(first.marks.filter((x:any)=>/sabado|domingo/.test(x.tipo)).every((x:any)=>!x.entrada&&!x.saida)).toBe(true)
  })

  it('identifica cargo no nome da planilha sem mantê-lo no nome do funcionário',()=>{
    expect(parseEmployeeIdentity('Adenir encanador')).toEqual({name:'Adenir',roleHint:'Encanador'})
    expect(parseEmployeeIdentity('Carlos - ajudante')).toEqual({name:'Carlos',roleHint:'Ajudante de Encanador'})
  })

  it('gera ficha e recibos juntos no mês, com identificação completa, sem mover arquivos antigos',async()=>{
    const {db,employee,base,time}=setup()
    time.autoFill({funcionario_id:employee.id,competencia:'2026-08'})
    const folha=db.save('folhas_pagamento',{empresa_id:employee.empresa_id,competencia:'2026-08',status:'aberta'})
    db.save('folha_lancamentos',{folha_id:folha.id,funcionario_id:employee.id,tipo:'beneficio_cafe',descricao:'Café',natureza:'credito',quinzena:1,valor_centavos:18000})
    db.save('folha_lancamentos',{folha_id:folha.id,funcionario_id:employee.id,tipo:'beneficio_vale_alimentacao',descricao:'Vale-alimentação',natureza:'credito',quinzena:1,valor_centavos:45000})
    db.save('folha_lancamentos',{folha_id:folha.id,funcionario_id:employee.id,tipo:'beneficio_vale_transporte',descricao:'Vale-transporte',natureza:'credito',quinzena:1,valor_centavos:22000})

    const legacy=path.join(base,'Mensal','2026','08 - agosto','Folha de ponto','arquivo-antigo.pdf')
    fs.mkdirSync(path.dirname(legacy),{recursive:true})
    fs.writeFileSync(legacy,'arquivo legado preservado','utf8')

    time.printHtml=async(html:string,destination:string)=>{fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,html,'utf8')}
    const result=await time.generateDocuments({funcionario_id:employee.id,competencia:'2026-08',paymentDate:'2026-08-15'})

    const expectedFolder=path.join(base,'Recibos','2026','08 - agosto')
    expect(result.folder).toBe(expectedFolder)
    expect(path.dirname(result.point.path)).toBe(expectedFolder)
    expect(path.dirname(result.receipt.path)).toBe(expectedFolder)
    expect(fs.existsSync(result.point.path)).toBe(true)
    expect(fs.existsSync(result.receipt.path)).toBe(true)
    expect(fs.existsSync(legacy)).toBe(true)

    const point=fs.readFileSync(result.point.path,'utf8')
    const receipt=fs.readFileSync(result.receipt.path,'utf8')
    for(const html of [point,receipt]){
      expect(html).toContain('Pessoa Teste Completa')
      expect(html).toContain('123.456.789-01')
      expect(html).toContain('Empresa Teste LTDA')
      expect(html).toContain('50.733.669/0001-60')
      expect(html).toContain('Cargo Teste Mensal')
    }
    expect(receipt).toContain('Vale café')
    expect(receipt).toContain('R$ 180,00')
    expect(receipt).toContain('Vale-alimentação')
    expect(receipt).toContain('R$ 510,00')
    expect(receipt).not.toContain('Vale-transporte')
  })

  it('mantém alimentação e café juntos no recibo e exclui vale-transporte do fluxo de assinatura',()=>{
    const benefits=normalizeMhBenefits([
      {descricao:'Vale-alimentação',valor_centavos:45000},
      {descricao:'Café',valor_centavos:12000},
      {descricao:'Vale-transporte',valor_centavos:22000},
      {descricao:'Prêmio',valor_centavos:9000}
    ])
    expect(benefits).toEqual([
      {descricao:'Vale café',valor_centavos:18000},
      {descricao:'Vale-alimentação',valor_centavos:51000}
    ])
  })

  it('bloqueia documentos mensais quando o funcionário não tem cargo/função',async()=>{
    const {db,employee,time}=setup()
    db.db.prepare('UPDATE funcionarios SET cargo_id=NULL WHERE id=?').run(employee.id)
    time.printHtml=async()=>{}
    await expect(time.generateDocuments({funcionario_id:employee.id,competencia:'2026-08',paymentDate:'2026-08-15'})).rejects.toThrow('cargo/função')
  })

  it('monta lote de impressão na ordem funcionário: ficha, recibos, próximo funcionário',async()=>{
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fluxo-print-batch-'))
    try{
      const files={aPoint:path.join(dir,'a-point.pdf'),aReceipt:path.join(dir,'a-receipt.pdf'),bPoint:path.join(dir,'b-point.pdf'),bReceipt:path.join(dir,'b-receipt.pdf')}
      await onePagePdf(files.aPoint,101);await onePagePdf(files.aReceipt,102);await onePagePdf(files.bPoint,201);await onePagePdf(files.bReceipt,202)
      const bytes=await mergeGeneratedPdfs([
        {ok:true,nome:'A',point:{path:files.aPoint},receipt:{path:files.aReceipt}},
        {ok:true,nome:'B',point:{path:files.bPoint},receipt:{path:files.bReceipt}}
      ],{point:true,receipts:true})
      const merged=await PDFDocument.load(bytes)
      expect(merged.getPages().map((page:any)=>Math.round(page.getWidth()))).toEqual([101,102,201,202])
    }finally{fs.rmSync(dir,{recursive:true,force:true})}
  })

  it('permite imprimir somente um tipo de documento',async()=>{
    const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fluxo-print-filter-'))
    try{
      const point=path.join(dir,'point.pdf'),receipt=path.join(dir,'receipt.pdf')
      await onePagePdf(point,111);await onePagePdf(receipt,112)
      const bytes=await mergeGeneratedPdfs([{ok:true,nome:'A',point:{path:point},receipt:{path:receipt}}],{point:false,receipts:true})
      const merged=await PDFDocument.load(bytes)
      expect(merged.getPages().map((page:any)=>Math.round(page.getWidth()))).toEqual([112])
    }finally{fs.rmSync(dir,{recursive:true,force:true})}
  })

  it('monta HTML imprimível real em vez de mandar o visualizador PDF oculto para a impressora',()=>{
    const html=buildPrintBatchHtml([
      {ok:true,nome:'A',pointHtml:'<div>FICHA A</div>',receiptHtml:'<div>RECIBOS A</div>'},
      {ok:true,nome:'B',pointHtml:'<div>FICHA B</div>',receiptHtml:'<div>RECIBOS B</div>'}
    ],{point:true,receipts:true})
    expect(html).toContain('FICHA A')
    expect(html).toContain('RECIBOS A')
    expect(html).toContain('FICHA B')
    expect(html).toContain('RECIBOS B')
    expect(html.indexOf('FICHA A')).toBeLessThan(html.indexOf('RECIBOS A'))
    expect(html.indexOf('RECIBOS A')).toBeLessThan(html.indexOf('FICHA B'))
    expect(html).not.toContain('<embed')
    expect(html).not.toContain('<iframe')
  })
})