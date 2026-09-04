import { describe, expect, it } from 'vitest'
import { ADMISSION_DOCUMENTS, employeeDocumentMatrix } from './admission-documents.cjs'

describe('MH admission documents', () => {
  it('keeps the canonical internal document set without livro_registro', () => {
    expect(ADMISSION_DOCUMENTS.map((item: any) => item.key)).toEqual([
      'contrato_experiencia',
      'ficha_registro',
      'ordem_servico',
      'vale_transporte',
      'ficha_epi',
      'carta_sindical'
    ])
    expect(ADMISSION_DOCUMENTS.some((item: any) => item.key === 'livro_registro')).toBe(false)
  })

  it('defines a single employee data matrix shared by all admission documents', () => {
    const fields = employeeDocumentMatrix.map((item: any) => item.key)
    expect(fields).toContain('nome')
    expect(fields).toContain('cpf')
    expect(fields).toContain('matricula_esocial')
    expect(fields).toContain('ctps_uf')
    expect(fields).toContain('titulo_eleitor_zona')
    expect(fields).toContain('fgts_opcao_em')
    expect(fields).toContain('endereco_bairro')
    expect(fields).toContain('cbo')
  })
})
