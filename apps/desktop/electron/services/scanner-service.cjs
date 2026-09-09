const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const { PDFDocument } = require('pdf-lib')
const { sha256 } = require('./file-service.cjs')

const execFileAsync = promisify(execFile)
const MODES = new Set(['grayscale', 'color'])
const A4 = [595.28, 841.89]

function normalizedFolderName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function signedDestinationFor(originalPath, pathApi = path) {
  if (!originalPath || typeof originalPath !== 'string') throw new Error('Documento original indisponível.')
  const originalFolder = pathApi.dirname(originalPath)
  const unsigned = normalizedFolderName(pathApi.basename(originalFolder)) === 'nao assinados'
  const signedFolder = unsigned ? pathApi.join(pathApi.dirname(originalFolder), 'Assinados') : pathApi.join(originalFolder, 'Assinados')
  const extension = pathApi.extname(originalPath)
  const stem = pathApi.basename(originalPath, extension)
  return pathApi.join(signedFolder, `${stem}_ASSINADO.pdf`)
}

function signedArchivePath(destination, version, pathApi = path) {
  const extension = pathApi.extname(destination) || '.pdf'
  const stem = pathApi.basename(destination, extension)
  const safeVersion = Math.max(1, Number(version) || 1)
  return pathApi.join(pathApi.dirname(destination), `${stem}_v${safeVersion}${extension}`)
}

function assertMode(mode) {
  const value = String(mode || 'grayscale')
  if (!MODES.has(value)) throw new Error('Modo de digitalização inválido.')
  return value
}

function publicSession(session) {
  return {
    sessionId: session.id,
    pages: session.pages.map((page, index) => ({ index, mode: page.mode, preview: `data:image/jpeg;base64,${fs.readFileSync(page.path).toString('base64')}` }))
  }
}

function managedDestination(fileService, destination) {
  const root = path.resolve(fileService.documentsDir)
  const target = path.resolve(destination)
  const relative = path.relative(root, target)
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('Destino fora da área gerenciada de documentos.')
  return target
}

function firstAvailableArchive(destination, preferredVersion) {
  let version = Math.max(1, Number(preferredVersion) || 1)
  let candidate = signedArchivePath(destination, version)
  while (fs.existsSync(candidate)) {
    version += 1
    candidate = signedArchivePath(destination, version)
  }
  return candidate
}

function wiaScript() {
  return `param(
  [Parameter(Mandatory=$true)][string]$Destination,
  [ValidateSet('grayscale','color')][string]$Mode='grayscale',
  [int]$Dpi=300
)
$ErrorActionPreference='Stop'
function Set-WiaProperty($Properties,[int]$PropertyId,$Value) {
  foreach($property in $Properties) {
    if([int]$property.PropertyID -eq $PropertyId) {
      try { $property.Value=$Value } catch { }
      return
    }
  }
}
function Set-WiaExtentMax($Properties,[int]$PropertyId) {
  foreach($property in $Properties) {
    if([int]$property.PropertyID -eq $PropertyId) {
      try { if($null -ne $property.SubTypeMax) { $property.Value=$property.SubTypeMax } } catch { }
      return
    }
  }
}
try {
  $manager=New-Object -ComObject WIA.DeviceManager
  $scannerInfo=$null
  foreach($deviceInfo in $manager.DeviceInfos) {
    if([int]$deviceInfo.Type -eq 1) { $scannerInfo=$deviceInfo; break }
  }
  if($null -eq $scannerInfo) { throw 'Nenhum scanner compatível com WIA foi encontrado. Verifique se o scanner está ligado e se o driver Epson está instalado.' }
  $device=$scannerInfo.Connect()
  if($device.Items.Count -lt 1) { throw 'O scanner WIA não disponibilizou uma área de digitalização.' }
  $item=$device.Items.Item(1)
  Set-WiaProperty $item.Properties 6147 $Dpi
  Set-WiaProperty $item.Properties 6148 $Dpi
  Set-WiaProperty $item.Properties 6146 $(if($Mode -eq 'color'){1}else{2})
  Set-WiaProperty $item.Properties 6149 0
  Set-WiaProperty $item.Properties 6150 0
  Set-WiaExtentMax $item.Properties 6151
  Set-WiaExtentMax $item.Properties 6152
  $jpeg='{B96B3CAE-0728-11D3-9D7B-0000F81EF32E}'
  $image=$item.Transfer($jpeg)
  if(Test-Path -LiteralPath $Destination) { Remove-Item -LiteralPath $Destination -Force }
  $image.SaveFile($Destination)
  if(!(Test-Path -LiteralPath $Destination)) { throw 'O scanner não retornou uma imagem.' }
  exit 0
} catch {
  [Console]::Error.WriteLine($_.Exception.Message)
  exit 42
}`
}

class ScannerService {
  constructor({ db, fileService, dataDir, platform = process.platform, acquirePage = null }) {
    this.db = db
    this.fileService = fileService
    this.dataDir = dataDir
    this.platform = platform
    this.sessions = new Map()
    this.cacheDir = path.join(dataDir, '.scanner-cache')
    fs.mkdirSync(this.cacheDir, { recursive: true })
    this.powershellPath = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    this.acquirePage = acquirePage || ((options) => this.acquireWiaPage(options))
  }

  capabilities() {
    const supported = this.platform === 'win32'
    const available = supported && (fs.existsSync(this.powershellPath) || this.acquirePage !== this.acquireWiaPage)
    return { platform: this.platform, supported, available, backend: supported ? 'wia' : null, dpi: 300, modes: ['grayscale', 'color'] }
  }

  getSession(sessionId) {
    const session = this.sessions.get(String(sessionId || ''))
    if (!session) throw new Error('Sessão de digitalização não encontrada ou já encerrada.')
    return session
  }

  newPagePath(sessionId) {
    return path.join(this.cacheDir, `${sessionId}-${crypto.randomUUID()}.jpg`)
  }

  async capture(mode) {
    mode = assertMode(mode)
    if (this.platform !== 'win32') throw new Error('A digitalização direta está disponível somente no Windows nesta versão.')
    const destination = this.newPagePath('scan')
    try {
      await this.acquirePage({ destination, mode, dpi: 300 })
      if (!fs.existsSync(destination) || fs.statSync(destination).size === 0) throw new Error('O scanner não retornou uma imagem válida.')
      return { path: destination, mode }
    } catch (error) {
      fs.rmSync(destination, { force: true })
      throw error
    }
  }

  async start({ mode = 'grayscale' } = {}) {
    const session = { id: crypto.randomUUID(), pages: [] }
    this.sessions.set(session.id, session)
    try {
      session.pages.push(await this.capture(mode))
      return publicSession(session)
    } catch (error) {
      this.discard({ sessionId: session.id })
      throw error
    }
  }

  async addPage({ sessionId, mode = 'grayscale' } = {}) {
    const session = this.getSession(sessionId)
    session.pages.push(await this.capture(mode))
    return publicSession(session)
  }

  async redoPage({ sessionId, pageIndex, mode = 'grayscale' } = {}) {
    const session = this.getSession(sessionId)
    const index = Number(pageIndex)
    if (!Number.isInteger(index) || index < 0 || index >= session.pages.length) throw new Error('Página de digitalização inválida.')
    const replacement = await this.capture(mode)
    const previous = session.pages[index]
    session.pages[index] = replacement
    fs.rmSync(previous.path, { force: true })
    return publicSession(session)
  }

  async discard({ sessionId } = {}) {
    const id = String(sessionId || '')
    const session = this.sessions.get(id)
    if (!session) return true
    for (const page of session.pages) fs.rmSync(page.path, { force: true })
    this.sessions.delete(id)
    return true
  }

  async acquireWiaPage({ destination, mode, dpi }) {
    if (this.platform !== 'win32') throw new Error('A digitalização direta está disponível somente no Windows nesta versão.')
    if (!fs.existsSync(this.powershellPath)) throw new Error('Windows PowerShell 5.1 não encontrado. Não foi possível iniciar o WIA.')
    const scriptPath = path.join(this.cacheDir, 'wia-scan.ps1')
    if (!fs.existsSync(scriptPath) || fs.readFileSync(scriptPath, 'utf8') !== wiaScript()) fs.writeFileSync(scriptPath, wiaScript(), 'utf8')
    try {
      await execFileAsync(this.powershellPath, ['-NoProfile', '-STA', '-ExecutionPolicy', 'Bypass', '-File', scriptPath, '-Destination', destination, '-Mode', assertMode(mode), '-Dpi', String(dpi || 300)], { windowsHide: true, timeout: 180000, maxBuffer: 1024 * 1024 })
    } catch (error) {
      const detail = String(error?.stderr || error?.message || '').trim().split(/\r?\n/).filter(Boolean).slice(-1)[0]
      throw new Error(detail || 'Não foi possível digitalizar. Verifique o scanner Epson e tente novamente.')
    }
  }

  async makePdf(session, destination) {
    const pdf = await PDFDocument.create()
    for (const pageImage of session.pages) {
      const bytes = fs.readFileSync(pageImage.path)
      const image = await pdf.embedJpg(bytes)
      const landscape = image.width > image.height
      const pageSize = landscape ? [A4[1], A4[0]] : A4
      const page = pdf.addPage(pageSize)
      const margin = 18
      const maxWidth = page.getWidth() - margin * 2
      const maxHeight = page.getHeight() - margin * 2
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height)
      const width = image.width * scale
      const height = image.height * scale
      page.drawImage(image, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height })
    }
    fs.writeFileSync(destination, await pdf.save())
  }

  latestSigned(documentId) {
    return this.db.db.prepare(`SELECT d.*,a.caminho AS arquivo_caminho,a.id AS arquivo_registro_id
      FROM documentos d JOIN arquivos a ON a.id=d.arquivo_id
      WHERE d.documento_origem_id=? AND d.status_assinatura='assinado' AND d.deleted_at IS NULL
      ORDER BY d.versao DESC,d.id DESC LIMIT 1`).get(documentId)
  }

  nextSignedVersion(documentId) {
    const row = this.db.db.prepare(`SELECT COALESCE(MAX(versao),0)+1 AS value FROM documentos
      WHERE documento_origem_id=? AND status_assinatura='assinado' AND deleted_at IS NULL`).get(documentId)
    return Number(row?.value || 1)
  }

  archiveExisting(destination, existingSigned) {
    if (!fs.existsSync(destination)) return null
    const preferredVersion = existingSigned?.versao || 1
    const archive = firstAvailableArchive(destination, preferredVersion)
    fs.renameSync(destination, archive)
    if (existingSigned?.arquivo_registro_id && path.resolve(existingSigned.arquivo_caminho) === path.resolve(destination)) {
      const file = this.db.get('arquivos', existingSigned.arquivo_registro_id)
      if (file) this.db.save('arquivos', { ...file, nome_original: path.basename(archive), nome_armazenado: path.basename(archive), caminho: archive })
    }
    return archive
  }

  async saveSigned({ sessionId, documentId, replace = false } = {}) {
    const session = this.getSession(sessionId)
    if (!session.pages.length) throw new Error('Nenhuma página foi digitalizada.')
    const original = this.db.get('documentos', Number(documentId))
    if (!original || !original.arquivo_id || !original.funcionario_id) throw new Error('Documento de funcionário inválido para digitalização.')
    const originalFile = this.db.get('arquivos', original.arquivo_id)
    if (!originalFile?.caminho || !fs.existsSync(originalFile.caminho)) throw new Error('Arquivo original não encontrado.')
    this.fileService.assertManagedPath(originalFile.caminho)
    const destination = managedDestination(this.fileService, signedDestinationFor(originalFile.caminho))
    const existingSigned = this.latestSigned(original.id)
    if (fs.existsSync(destination) && !replace) return { conflict: true, path: destination, existingDocumentId: existingSigned?.id || null }

    fs.mkdirSync(path.dirname(destination), { recursive: true })
    const part = `${destination}.part-${crypto.randomUUID()}`
    try {
      await this.makePdf(session, part)
      if (replace) this.archiveExisting(destination, existingSigned)
      fs.renameSync(part, destination)
      const stat = fs.statSync(destination)
      const file = this.db.save('arquivos', {
        nome_original: path.basename(destination), nome_armazenado: path.basename(destination), caminho: destination,
        tamanho: stat.size, extensao: '.pdf', mime_type: 'application/pdf', hash: sha256(destination), origem: 'digitalizado_scanner'
      })
      const version = this.nextSignedVersion(original.id)
      const document = this.db.save('documentos', {
        arquivo_id: file.id,
        empresa_id: original.empresa_id,
        obra_id: original.obra_id,
        frente_id: original.frente_id,
        funcionario_id: original.funcionario_id,
        categoria: original.categoria,
        titulo: original.titulo,
        status_assinatura: 'assinado',
        documento_origem_id: original.id,
        versao: version,
        observacoes: 'Versão assinada digitalizada pelo scanner no Fluxo DRE.'
      })
      await this.discard({ sessionId: session.id })
      return { conflict: false, path: destination, document }
    } catch (error) {
      fs.rmSync(part, { force: true })
      throw error
    }
  }

  dispose() {
    for (const sessionId of [...this.sessions.keys()]) this.discard({ sessionId })
    try {
      if (fs.existsSync(this.cacheDir) && fs.readdirSync(this.cacheDir).length === 0) fs.rmdirSync(this.cacheDir)
    } catch {}
  }
}

module.exports = { ScannerService, signedDestinationFor, signedArchivePath, wiaScript }
