import { ChevronLeft, ChevronRight, ExternalLink, File, FileImage, FileText, Folder, FolderOpen, Link2, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, Loading, SearchInput } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import type { ExplorerDirectory, ExplorerEntry, FileExplorerProps } from './types'
import './file-explorer.css'

function formatSize(size: number | null) {
  if (size == null) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(size < 10 * 1024 ? 1 : 0)} KB`
  return `${(size / (1024 * 1024)).toFixed(size < 10 * 1024 * 1024 ? 1 : 0)} MB`
}

function formatModified(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

function entryIcon(entry: ExplorerEntry) {
  if (entry.kind === 'folder') return <Folder size={29} strokeWidth={1.65}/>
  if (entry.kind === 'link') return <Link2 size={26} strokeWidth={1.65}/>
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(entry.extension)) return <FileImage size={27} strokeWidth={1.65}/>
  if (/\.(pdf|txt|docx?|xlsx?|csv)$/i.test(entry.extension)) return <FileText size={27} strokeWidth={1.65}/>
  return <File size={27} strokeWidth={1.65}/>
}

function breadcrumbParts(relativePath: string, rootLabel: string) {
  const parts = relativePath.split('/').filter(Boolean)
  return [
    { label: rootLabel, relativePath: '' },
    ...parts.map((label, index) => ({ label, relativePath: parts.slice(0, index + 1).join('/') }))
  ]
}

export function FileExplorer({
  rootId,
  rootLabel = 'Arquivos',
  initialPath = '',
  title = 'Explorador de arquivos',
  description = 'Visualize as pastas físicas gerenciadas pelo sistema sem sair do aplicativo.',
  emptyTitle = 'Esta pasta está vazia',
  className = ''
}: FileExplorerProps) {
  const [relativePath, setRelativePath] = useState(initialPath)
  const [search, setSearch] = useState('')
  const listing = useAsync<ExplorerDirectory>(() => window.fluxoDre.explorador.list(rootId, relativePath), [rootId, relativePath])
  const breadcrumbs = useMemo(() => breadcrumbParts(relativePath, rootLabel), [relativePath, rootLabel])
  const items = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')
    if (!query) return listing.data?.items || []
    return (listing.data?.items || []).filter((item) => item.name.toLocaleLowerCase('pt-BR').includes(query))
  }, [listing.data, search])

  const openEntry = async (entry: ExplorerEntry) => {
    if (!entry.canOpen) return
    if (entry.kind === 'folder') {
      setSearch('')
      setRelativePath(entry.relativePath)
      return
    }
    await window.fluxoDre.explorador.open(rootId, entry.relativePath)
  }

  const openCurrentInSystem = () => window.fluxoDre.explorador.open(rootId, relativePath)

  return <section className={`file-explorer ${className}`.trim()} aria-label={title}>
    <div className="file-explorer-toolbar">
      <div className="file-explorer-heading">
        <div className="file-explorer-title-line"><strong>{title}</strong><span>Somente leitura</span></div>
        <p>{description}</p>
      </div>
      <div className="file-explorer-actions">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar nesta pasta..."/>
        <Button variant="secondary" icon={<RefreshCw size={15}/>} onClick={() => listing.reload()}>Atualizar</Button>
        <Button variant="secondary" icon={<FolderOpen size={15}/>} onClick={openCurrentInSystem}>Abrir no Windows</Button>
      </div>
    </div>

    <div className="file-explorer-nav">
      {relativePath && <button className="file-explorer-back" type="button" onClick={() => { setSearch(''); setRelativePath(listing.data?.parentRelativePath || '') }} aria-label="Voltar uma pasta"><ChevronLeft size={16}/> Voltar</button>}
      <nav className="file-explorer-breadcrumbs" aria-label="Caminho da pasta">
        {breadcrumbs.map((crumb, index) => <span key={`${crumb.relativePath}-${index}`}>
          {index > 0 && <ChevronRight size={13}/>}<button type="button" onClick={() => { setSearch(''); setRelativePath(crumb.relativePath) }} aria-current={crumb.relativePath === relativePath ? 'page' : undefined}>{crumb.label}</button>
        </span>)}
      </nav>
      <span className="file-explorer-count">{listing.data?.items.length || 0} itens</span>
    </div>

    {listing.loading ? <div className="file-explorer-state"><Loading/></div> : listing.error ? <div className="file-explorer-state file-explorer-error"><strong>Não foi possível abrir esta pasta</strong><p>{listing.error.message}</p><Button variant="secondary" onClick={() => listing.reload()}>Tentar novamente</Button></div> : items.length ? <div className="file-explorer-grid">
      {items.map((entry) => <article className={`file-explorer-item file-explorer-${entry.kind}`} key={entry.relativePath}>
        <button className="file-explorer-item-main" type="button" onClick={() => openEntry(entry)} disabled={!entry.canOpen} title={entry.kind === 'folder' ? `Abrir ${entry.name}` : entry.canOpen ? `Abrir ${entry.name} no Windows` : 'Atalho não disponível'}>
          <span className="file-explorer-item-icon">{entryIcon(entry)}</span>
          <span className="file-explorer-item-copy"><strong>{entry.name}</strong><small>{entry.kind === 'folder' ? 'Pasta' : entry.kind === 'link' ? 'Atalho simbólico bloqueado' : [formatSize(entry.size), formatModified(entry.modifiedAt)].filter(Boolean).join(' · ')}</small></span>
          {entry.kind === 'file' && entry.canOpen && <ExternalLink className="file-explorer-external" size={14}/>} 
        </button>
        {entry.kind === 'folder' && entry.canOpen && <button className="file-explorer-system-action" type="button" onClick={() => window.fluxoDre.explorador.open(rootId, entry.relativePath)}><ExternalLink size={13}/> Abrir no Windows</button>}
      </article>)}
    </div> : <div className="file-explorer-state"><Folder size={34}/><strong>{search ? 'Nenhum item encontrado' : emptyTitle}</strong><p>{search ? 'Altere a busca para ver outros arquivos desta pasta.' : 'Quando houver arquivos ou subpastas, eles aparecerão aqui automaticamente.'}</p></div>}
  </section>
}
