const fs = require('node:fs')
const path = require('node:path')

const DEFAULT_MAX_PREVIEW_BYTES = 12 * 1024 * 1024
const PREVIEW_TYPES = new Map([
  ['.pdf', { previewKind: 'pdf', mimeType: 'application/pdf' }],
  ['.png', { previewKind: 'image', mimeType: 'image/png' }],
  ['.jpg', { previewKind: 'image', mimeType: 'image/jpeg' }],
  ['.jpeg', { previewKind: 'image', mimeType: 'image/jpeg' }],
  ['.gif', { previewKind: 'image', mimeType: 'image/gif' }],
  ['.webp', { previewKind: 'image', mimeType: 'image/webp' }],
  ['.bmp', { previewKind: 'image', mimeType: 'image/bmp' }]
])

function portablePath(value) {
  return String(value || '').split(path.sep).join('/')
}

function escapesRoot(relative) {
  return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)
}

class ManagedDirectoryService {
  constructor({ roots, shell, maxPreviewBytes } = {}) {
    this.roots = roots || {}
    this.shell = shell
    this.maxPreviewBytes = Number.isFinite(maxPreviewBytes) && Number(maxPreviewBytes) > 0 ? Number(maxPreviewBytes) : DEFAULT_MAX_PREVIEW_BYTES
  }

  rootFor(rootId) {
    const resolver = this.roots[String(rootId || '')]
    if (!resolver) throw new Error('Área de arquivos não autorizada.')
    const raw = typeof resolver === 'function' ? resolver() : resolver
    if (!raw || typeof raw !== 'string') throw new Error('Área de arquivos indisponível.')
    const root = path.resolve(raw)
    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error('Pasta raiz de documentos indisponível.')
    return root
  }

  normalizeRelative(relativePath = '') {
    if (relativePath == null || relativePath === '') return ''
    if (typeof relativePath !== 'string' || path.isAbsolute(relativePath)) throw new Error('Caminho inválido.')
    const segments = relativePath.split(/[\\/]+/).filter((segment) => segment && segment !== '.')
    if (segments.some((segment) => segment === '..')) throw new Error('Caminho fora da área gerenciada.')
    return segments.join(path.sep)
  }

  resolve(rootId, relativePath = '') {
    const root = this.rootFor(rootId)
    const relativeNative = this.normalizeRelative(relativePath)
    const target = path.resolve(root, relativeNative)
    if (escapesRoot(path.relative(root, target))) throw new Error('Caminho fora da área gerenciada.')
    if (!fs.existsSync(target)) throw new Error('Arquivo ou pasta não encontrado.')

    const rootReal = fs.realpathSync(root)
    const targetReal = fs.realpathSync(target)
    if (escapesRoot(path.relative(rootReal, targetReal))) throw new Error('Caminho fora da área gerenciada.')

    return { root, target, relativeNative, stat: fs.statSync(target) }
  }

  list({ rootId, relativePath = '' } = {}) {
    const resolved = this.resolve(rootId, relativePath)
    if (!resolved.stat.isDirectory()) throw new Error('O caminho informado não é uma pasta.')

    const parentNative = resolved.relativeNative ? path.dirname(resolved.relativeNative) : ''
    const parentRelativePath = !resolved.relativeNative ? null : portablePath(parentNative === '.' ? '' : parentNative)
    const items = fs.readdirSync(resolved.target, { withFileTypes: true }).map((entry) => {
      const absolute = path.join(resolved.target, entry.name)
      const stat = fs.lstatSync(absolute)
      const isLink = stat.isSymbolicLink()
      const kind = isLink ? 'link' : entry.isDirectory() ? 'folder' : entry.isFile() ? 'file' : 'link'
      return {
        name: entry.name,
        relativePath: portablePath(path.relative(resolved.root, absolute)),
        kind,
        extension: kind === 'file' ? path.extname(entry.name).toLowerCase() : '',
        size: kind === 'file' ? stat.size : null,
        modifiedAt: stat.mtime.toISOString(),
        canOpen: !isLink && (entry.isDirectory() || entry.isFile())
      }
    }).sort((left, right) => {
      const weight = { folder: 0, file: 1, link: 2 }
      const difference = weight[left.kind] - weight[right.kind]
      return difference || left.name.localeCompare(right.name, 'pt-BR', { numeric: true, sensitivity: 'base' })
    })

    return {
      rootId: String(rootId),
      name: resolved.relativeNative ? path.basename(resolved.target) : path.basename(resolved.root),
      relativePath: portablePath(resolved.relativeNative),
      parentRelativePath,
      items
    }
  }

  preview({ rootId, relativePath } = {}) {
    const resolved = this.resolve(rootId, relativePath)
    const linkStat = fs.lstatSync(resolved.target)
    if (linkStat.isSymbolicLink()) throw new Error('Atalhos simbólicos não podem ser visualizados por este explorador.')
    if (!resolved.stat.isFile()) throw new Error('Somente arquivos podem ser visualizados.')

    const extension = path.extname(resolved.target).toLowerCase()
    const previewType = PREVIEW_TYPES.get(extension)
    const base = {
      rootId: String(rootId),
      name: path.basename(resolved.target),
      relativePath: portablePath(resolved.relativeNative),
      extension,
      size: resolved.stat.size,
      modifiedAt: resolved.stat.mtime.toISOString(),
      previewKind: previewType?.previewKind || 'unsupported',
      mimeType: previewType?.mimeType || null,
      dataUrl: null,
      previewBlockedReason: previewType ? null : 'type'
    }

    if (!previewType) return base
    if (resolved.stat.size > this.maxPreviewBytes) return { ...base, previewKind: 'unsupported', previewBlockedReason: 'size' }

    const bytes = fs.readFileSync(resolved.target)
    return {
      ...base,
      previewKind: previewType.previewKind,
      mimeType: previewType.mimeType,
      dataUrl: `data:${previewType.mimeType};base64,${bytes.toString('base64')}`,
      previewBlockedReason: null
    }
  }

  async open({ rootId, relativePath = '' } = {}) {
    const resolved = this.resolve(rootId, relativePath)
    if (fs.lstatSync(resolved.target).isSymbolicLink()) throw new Error('Atalhos simbólicos não podem ser abertos por este explorador.')
    if (!this.shell?.openPath) throw new Error('Integração com o sistema operacional indisponível.')
    return this.shell.openPath(resolved.target)
  }
}

module.exports = { ManagedDirectoryService, portablePath, DEFAULT_MAX_PREVIEW_BYTES }
