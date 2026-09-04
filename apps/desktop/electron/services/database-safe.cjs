const fs = require('node:fs')
const path = require('node:path')
const { DatabaseService: BaseDatabaseService } = require('./database.cjs')

function sqlString(value) {
  return String(value).replaceAll("'", "''")
}

class DatabaseService extends BaseDatabaseService {
  createPreMigrationBackup() {
    const backupDir = path.join(this.dataDir, 'backups', 'pre-migration')
    fs.mkdirSync(backupDir, { recursive: true })

    let attempt = 0
    let backupPath
    do {
      const suffix = attempt ? `-${attempt}` : ''
      backupPath = path.join(backupDir, `fluxo-dre-${Date.now()}${suffix}.sqlite`)
      attempt += 1
    } while (fs.existsSync(backupPath))

    // better-sqlite3's Database#backup() is asynchronous. The desktop boot and
    // migration pipeline are deliberately synchronous, so awaiting that API here
    // would force an architectural change through Electron startup. SQLite's
    // VACUUM INTO creates a transactionally consistent snapshot synchronously,
    // including WAL-visible data, before any schema migration is applied.
    this.db.exec(`VACUUM INTO '${sqlString(backupPath)}'`)

    const stat = fs.statSync(backupPath)
    if (!stat.isFile() || stat.size === 0) {
      throw new Error('Não foi possível criar o backup de segurança antes da migração.')
    }
    return backupPath
  }

  migrate(existed) {
    const files = fs.readdirSync(this.migrationsDir).filter((file) => /^\d+.*\.sql$/.test(file)).sort()
    let current = 0
    try { current = this.db.pragma('user_version', { simple: true }) || 0 } catch {}
    const pending = files.filter((file) => Number(file.match(/^\d+/)[0]) > current)
    if (!pending.length) return

    if (existed && fs.statSync(this.dbPath).size > 0) this.createPreMigrationBackup()

    // The base service remains the single owner of migration ordering,
    // transactions, audit schema and PRAGMA user_version updates. Passing false
    // only suppresses its legacy asynchronous backup call, already replaced above.
    return super.migrate(false)
  }
}

module.exports = { DatabaseService }
