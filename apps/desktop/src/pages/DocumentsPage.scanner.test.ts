import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Central de documentos · integração visual do scanner', () => {
  it('expõe a ação de digitalização nos Registros e reutiliza o modal compartilhado', () => {
    const source = fs.readFileSync(new URL('./DocumentsPage.tsx', import.meta.url), 'utf8')
    expect(source).toContain('DocumentScannerModal')
    expect(source).toContain('canScanDocument')
    expect(source).toContain('scannerCapabilities')
    expect(source).toContain('scannerTarget')
    expect(source).toContain('Digitalizar versão assinada')
    expect(source).toContain('Promise.all([docs.reload(), files.reload()])')
  })
})
