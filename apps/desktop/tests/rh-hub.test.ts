import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const read = (relative: string) => readFileSync(resolve(here, relative), 'utf8')

describe('RH hub navigation contract', () => {
  it('keeps existing RH routes and adds a dedicated /rh hub route', () => {
    const app = read('../src/App.tsx')
    expect(app).toContain('path="/rh"')
    expect(app).toContain('path="/funcionarios"')
    expect(app).toContain('path="/registro-funcionario"')
    expect(app).toContain('path="/ponto"')
    expect(app).toContain('path="/rh/modelos"')
  })

  it('makes the RH group title navigable without removing direct links', () => {
    const shell = read('../src/modules/command-center/CommandCenterShell.tsx')
    expect(shell).toContain("group.to")
    expect(shell).toContain("to: '/rh'")
    expect(shell).toContain("to: '/funcionarios'")
    expect(shell).toContain("to: '/registro-funcionario'")
    expect(shell).toContain("to: '/ponto'")
    expect(shell).toContain("to: '/rh/modelos'")
  })

  it('shows the four approved RH cards and a document center on the time sheet page', () => {
    const hub = read('../src/pages/RhHubPage.tsx')
    expect(hub).toContain('Funcionários')
    expect(hub).toContain('Registro de funcionário')
    expect(hub).toContain('Folhas de ponto e recibos')
    expect(hub).toContain('Modelos de documentos')

    const timeSheet = read('../src/pages/TimeSheetPage.tsx')
    expect(timeSheet).toContain('Documentos da competência')
    expect(timeSheet).toContain('Editar marcações do mês')
  })
})
