import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ManagedDirectoryService } from './managed-directory-service.cjs'

const created: string[] = []

function setup(options: { maxPreviewBytes?: number } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fluxo-explorer-'))
  created.push(root)
  const openPath = vi.fn(async () => '')
  const service = new ManagedDirectoryService({ roots: { documents: () => root }, shell: { openPath }, maxPreviewBytes: options.maxPreviewBytes })
  return { root, openPath, service }
}

afterEach(() => {
  for (const dir of created.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

describe('ManagedDirectoryService', () => {
  it('lista somente metadados relativos e ordena pastas antes de arquivos', () => {
    const { root, service } = setup()
    fs.mkdirSync(path.join(root, 'Funcionários'))
    fs.mkdirSync(path.join(root, 'Obras'))
    fs.writeFileSync(path.join(root, 'recibo.pdf'), 'pdf', 'utf8')

    const result = service.list({ rootId: 'documents' })

    expect(result.relativePath).toBe('')
    expect(result.parentRelativePath).toBeNull()
    expect(result.items.map((item: any) => [item.kind, item.name])).toEqual([
      ['folder', 'Funcionários'],
      ['folder', 'Obras'],
      ['file', 'recibo.pdf']
    ])
    expect(result.items.every((item: any) => !path.isAbsolute(item.relativePath))).toBe(true)
    expect(result.items.find((item: any) => item.name === 'recibo.pdf')).toMatchObject({ extension: '.pdf', size: 3, canOpen: true })
  })

  it('navega em subpastas usando caminho relativo portátil', () => {
    const { root, service } = setup()
    const monthly = path.join(root, 'Empresa', 'Funcionários', 'Pessoa', 'Recibos', '2026', '09 - setembro', 'Não assinados')
    fs.mkdirSync(monthly, { recursive: true })
    fs.writeFileSync(path.join(monthly, 'Ficha.pdf'), 'conteudo', 'utf8')

    const result = service.list({ rootId: 'documents', relativePath: 'Empresa/Funcionários/Pessoa/Recibos/2026/09 - setembro/Não assinados' })

    expect(result.name).toBe('Não assinados')
    expect(result.parentRelativePath).toBe('Empresa/Funcionários/Pessoa/Recibos/2026/09 - setembro')
    expect(result.items[0]).toMatchObject({ name: 'Ficha.pdf', kind: 'file' })
  })

  it('bloqueia travessia de diretório e caminhos absolutos', () => {
    const { root, service } = setup()
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'fluxo-explorer-outside-'))
    created.push(outside)

    expect(() => service.list({ rootId: 'documents', relativePath: '../' + path.basename(outside) })).toThrow('fora da área gerenciada')
    expect(() => service.list({ rootId: 'documents', relativePath: path.resolve(root) })).toThrow('Caminho inválido')
  })

  it('abre apenas caminhos existentes dentro da raiz autorizada', async () => {
    const { root, openPath, service } = setup()
    const folder = path.join(root, 'Funcionários')
    fs.mkdirSync(folder)

    await expect(service.open({ rootId: 'documents', relativePath: 'Funcionários' })).resolves.toBe('')
    expect(openPath).toHaveBeenCalledWith(folder)
    await expect(service.open({ rootId: 'documents', relativePath: 'inexistente' })).rejects.toThrow('não encontrado')
    await expect(service.open({ rootId: 'unknown', relativePath: '' })).rejects.toThrow('não autorizada')
  })

  it('gera preview interno somente para PDF e imagens e retorna metadados relativos', () => {
    const { root, service } = setup()
    fs.writeFileSync(path.join(root, 'contrato.pdf'), Buffer.from('%PDF-1.4\npreview'))
    fs.writeFileSync(path.join(root, 'foto.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]))
    fs.writeFileSync(path.join(root, 'dados.csv'), 'a,b\n1,2', 'utf8')

    const pdf = service.preview({ rootId: 'documents', relativePath: 'contrato.pdf' })
    const image = service.preview({ rootId: 'documents', relativePath: 'foto.png' })
    const unsupported = service.preview({ rootId: 'documents', relativePath: 'dados.csv' })

    expect(pdf).toMatchObject({ name: 'contrato.pdf', relativePath: 'contrato.pdf', extension: '.pdf', previewKind: 'pdf', mimeType: 'application/pdf' })
    expect(pdf.dataUrl).toMatch(/^data:application\/pdf;base64,/)
    expect(image).toMatchObject({ name: 'foto.png', previewKind: 'image', mimeType: 'image/png' })
    expect(image.dataUrl).toMatch(/^data:image\/png;base64,/)
    expect(unsupported).toMatchObject({ name: 'dados.csv', previewKind: 'unsupported', dataUrl: null })
    expect(pdf).not.toHaveProperty('absolutePath')
  })

  it('não carrega conteúdo de preview acima do limite configurado', () => {
    const { root, service } = setup({ maxPreviewBytes: 8 })
    fs.writeFileSync(path.join(root, 'grande.pdf'), Buffer.from('%PDF-1.4-mais-que-oito'))

    const result = service.preview({ rootId: 'documents', relativePath: 'grande.pdf' })

    expect(result).toMatchObject({ previewKind: 'unsupported', dataUrl: null, previewBlockedReason: 'size' })
  })
})
