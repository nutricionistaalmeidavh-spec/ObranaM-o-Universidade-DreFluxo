import { afterEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { DatabaseService } = require('./database.cjs')
const tempDirs: string[] = []

function tempDir(label: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fluxo-dre-${label}-`))
  tempDirs.push(dir)
  return dir
}

function projectMigrations() {
  return path.resolve(process.cwd(), 'database', 'migrations')
}

function copyMigrationsThrough(destination: string, maxVersion: number) {
  fs.mkdirSync(destination, { recursive: true })
  for (const file of fs.readdirSync(projectMigrations())) {
    const version = Number(file.match(/^\d+/)?.[0] || 0)
    if (version && version <= maxVersion) fs.copyFileSync(path.join(projectMigrations(), file), path.join(destination, file))
  }
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

describe('desktop database migrations', () => {
  it('opens a fresh database through MH admission docs v2 migrations', () => {
    const dataDir = tempDir('fresh')
    const db = new DatabaseService({ dataDir, migrationsDir: projectMigrations() })
    db.open()
    try {
      expect(db.db.pragma('user_version', { simple: true })).toBeGreaterThanOrEqual(16)
      const employeeColumns = new Set(db.db.prepare('PRAGMA table_info(funcionarios)').all().map((row: any) => row.name))
      for (const column of ['matricula_esocial','ctps_uf','endereco_logradouro','fgts_optante']) expect(employeeColumns.has(column)).toBe(true)
      expect(db.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='cargo_epi_kits'").get()).toBeTruthy()
      expect(db.db.prepare("SELECT valor FROM configuracoes WHERE chave='mh_admission_docs_version'").get()?.valor).toBe('2')
    } finally { db.close() }
  })

  it('upgrades an existing v13 database without losing existing employee rows', () => {
    const dataDir = tempDir('upgrade-data')
    const oldMigrations = tempDir('upgrade-migrations')
    copyMigrationsThrough(oldMigrations, 13)
    const before = new DatabaseService({ dataDir, migrationsDir: oldMigrations })
    before.open()
    const company = before.save('empresas', { razao_social: 'MH TESTE', cnpj: '00.000.000/0001-00' })
    const employee = before.save('funcionarios', { empresa_id: company.id, nome: 'FUNCIONARIO EXISTENTE', cpf: '00000000000', salario_centavos: 230296 })
    before.close()

    const after = new DatabaseService({ dataDir, migrationsDir: projectMigrations() })
    after.open()
    try {
      expect(after.db.pragma('user_version', { simple: true })).toBeGreaterThanOrEqual(16)
      expect(after.get('funcionarios', employee.id)?.nome).toBe('FUNCIONARIO EXISTENTE')
      expect(after.get('funcionarios', employee.id)?.salario_centavos).toBe(230296)
      expect(after.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='cargo_epi_kits'").get()).toBeTruthy()
    } finally { after.close() }
  })
})
