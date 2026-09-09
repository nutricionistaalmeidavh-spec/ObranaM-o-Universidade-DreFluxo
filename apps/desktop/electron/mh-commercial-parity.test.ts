import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const read = (relative: string) => readFile(resolve(root, relative), 'utf8')

describe('MH commercial parity guardrails', () => {
  it('keeps MH identity while adding shared context, hubs and AI routes', async () => {
    const [app, packageJson] = await Promise.all([read('src/App.tsx'), read('package.json')])
    expect(app).toContain('WorkContextProvider')
    expect(app).toContain('AiAssistantPage')
    expect(app).toContain('SettingsHubPage')
    expect(app).toContain('ProcurementContractsHubPage')
    expect(app).toContain('path="/assistente-ia"')
    expect(app).toContain('path="/compras-contratos"')
    expect(app).toContain('path="/configuracoes/sistema"')
    const pkg = JSON.parse(packageJson)
    expect(pkg.build.appId).toBe('br.com.fluxodre.app')
    expect(pkg.build.productName).toBe('Fluxo DRE')
    expect(packageJson).not.toMatch(/asaas|billing|license/i)
  })

  it('exposes the AI globally without turning the MH shell into the commercial edition', async () => {
    const shell = await read('src/modules/command-center/CommandCenterShell.tsx')
    expect(shell).toContain('WorkContextBar')
    expect(shell).toContain('GlobalAiAssistant')
    expect(shell).toContain('Fluxo DRE')
    expect(shell).not.toContain('<strong>Comercial</strong>')
    expect(shell).not.toContain('artisys.commercial.favorites')
  })

  it('loads additive command-center refinement layers only for the modern layout', async () => {
    const app = await read('src/App.tsx')
    expect(app).toContain("import('./modules/command-center/artisys-desktop.css')")
    expect(app).toContain("import('./modules/command-center/artisys-rh.css')")
    expect(app).toContain("import('./modules/command-center/artisys-operations.css')")
    expect(app).toContain("import('./modules/command-center/artisys-utilities.css')")
  })
})
