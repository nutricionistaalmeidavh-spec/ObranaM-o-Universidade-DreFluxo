export type ExplorerEntryKind = 'folder' | 'file' | 'link'

export type ExplorerEntry = {
  name: string
  relativePath: string
  kind: ExplorerEntryKind
  extension: string
  size: number | null
  modifiedAt: string
  canOpen: boolean
}

export type ExplorerDirectory = {
  rootId: string
  name: string
  relativePath: string
  parentRelativePath: string | null
  items: ExplorerEntry[]
}

export type ExplorerPreview = {
  rootId: string
  name: string
  relativePath: string
  extension: string
  size: number
  modifiedAt: string
  previewKind: 'pdf' | 'image' | 'unsupported'
  mimeType: string | null
  dataUrl: string | null
  previewBlockedReason: 'size' | 'type' | null
}

export type FileExplorerProps = {
  rootId: string
  rootLabel?: string
  initialPath?: string
  title?: string
  description?: string
  emptyTitle?: string
  className?: string
}
