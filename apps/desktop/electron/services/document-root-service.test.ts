import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DatabaseService } from './database.cjs'
import { FileService, sha256 } from './file-service.cjs'
import { DocumentRootService } from './document-root-service.cjs'

const created: Array<{ dir:string; db:any }> = []

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fluxo-root-service-'))
  const oldRoot = path.join(dir, 'old-docs')
  const newRoot = path.join(dir, 'new-docs')
  fs.mkdirSync(oldRoot, { recursive: true })
  fs.mkdirSync(newRoot, { recursive: true })
  const db = new DatabaseService({ dataDir: dir, migrationsDir: path.resolve(import.meta.dirname, '../../database/migrations') })
  db.open()
  created.push({ dir, db })
  const files = new FileService({ documentsDir: oldRoot, db })
  return { dir, oldRoot, newRoot, db, files }
}

function registerFile(db:any, absolutePath:string) {
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  fs.writeFileSync(absolutePath, 'conteúdo registrado', 'utf8')
  return db.save('arquivos', {
    nome_original: 'Nome recebido do cliente.pdf',
    nome_armazenado: path.basename(absolutePath),
    caminho: absolutePath,
    tamanho: fs.statSync(absolutePath).size,
    extensao: '.pdf',
    mime_type: 'application/pdf',
    hash: sha256(absolutePath),
    origem: 'importado'
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  for (const item of created.splice(0)) { item.db.close(); fs.rmSync(item.dir, { recursive: true, force: true }) }
})

describe('DocumentRootService', () => {
  it('copia documentos e remapeia caminhos registrados preservando nome_original', async () => {
    const { oldRoot, newRoot, db, files } = setup()
    const oldPath = path.join(oldRoot, 'Empresa', 'Funcionários', 'Pessoa', 'arquivo.pdf')
    const record = registerFile(db, oldPath)
    const dialogApi = {
      showOpenDialog: vi.fn(async () => ({ canceled: false, filePaths: [newRoot] })),
      showMessageBox: vi.fn(async () => ({ response: 0 }))
    }
    const service = new DocumentRootService({ db, files, defaultDir: oldRoot, dialogApi, shellApi: { openPath: vi.fn() } })

    const result = await service.chooseRoot()

    const expected = path.join(newRoot, 'Empresa', 'Funcionários', 'Pessoa', 'arquivo.pdf')
    expect(result).toMatchObject({ path: newRoot, previous: oldRoot, remapped: 1 })
    expect(fs.readFileSync(expected, 'utf8')).toBe('conteúdo registrado')
    const updated = db.get('arquivos', record.id)
    expect(updated.caminho).toBe(expected)
    expect(updated.nome_original).toBe('Nome recebido do cliente.pdf')
    expect(files.documentsDir).toBe(newRoot)
  })

  it('permite usar sem copiar somente quando a nova raiz já contém o mesmo arquivo registrado', async () => {
    const { oldRoot, newRoot, db, files } = setup()
    const oldPath = path.join(oldRoot, 'Empresa', 'arquivo.pdf')
    const record = registerFile(db, oldPath)
    const newPath = path.join(newRoot, 'Empresa', 'arquivo.pdf')
    fs.mkdirSync(path.dirname(newPath), { recursive: true })
    fs.copyFileSync(oldPath, newPath)
    const dialogApi = {
      showOpenDialog: vi.fn(async () => ({ canceled: false, filePaths: [newRoot] })),
      showMessageBox: vi.fn(async () => ({ response: 1 }))
    }
    const service = new DocumentRootService({ db, files, defaultDir: oldRoot, dialogApi, shellApi: { openPath: vi.fn() } })

    const result = await service.chooseRoot()

    expect(result).toMatchObject({ path: newRoot, remapped: 1 })
    expect(db.get('arquivos', record.id).caminho).toBe(newPath)
    expect(files.documentsDir).toBe(newRoot)
  })

  it('cancela a troca de raiz quando faltam documentos registrados no destino', async () => {
    const { oldRoot, newRoot, db, files } = setup()
    const oldPath = path.join(oldRoot, 'Empresa', 'arquivo.pdf')
    const record = registerFile(db, oldPath)
    const showMessageBox = vi.fn()
      .mockResolvedValueOnce({ response: 1 })
      .mockResolvedValueOnce({ response: 0 })
    const dialogApi = {
      showOpenDialog: vi.fn(async () => ({ canceled: false, filePaths: [newRoot] })),
      showMessageBox
    }
    const service = new DocumentRootService({ db, files, defaultDir: oldRoot, dialogApi, shellApi: { openPath: vi.fn() } })

    const result = await service.chooseRoot()

    expect(result).toBeNull()
    expect(db.get('arquivos', record.id).caminho).toBe(oldPath)
    expect(files.documentsDir).toBe(oldRoot)
    expect(service.getConfigured()).toBeNull()
    expect(showMessageBox).toHaveBeenCalledTimes(2)
  })
})
