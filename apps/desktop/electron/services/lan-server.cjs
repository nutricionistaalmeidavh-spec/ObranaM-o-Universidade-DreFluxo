'use strict'

/**
 * Compatibility shim for the legacy LAN server hook.
 *
 * The Desktop MH main process still imports LanServer, but the service is not
 * instantiated or used by the current runtime. Keeping this lightweight shim
 * prevents packaged builds from failing at startup while preserving the import
 * contract until the legacy hook is removed in a dedicated cleanup.
 */
class LanServer {
  constructor() {
    this.running = false
  }

  start() {
    this.running = true
    return { running: true }
  }

  stop() {
    this.running = false
    return { running: false }
  }

  status() {
    return { running: this.running }
  }
}

module.exports = { LanServer }
