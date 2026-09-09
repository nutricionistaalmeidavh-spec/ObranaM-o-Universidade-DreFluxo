import { ChevronLeft, ChevronRight, ExternalLink, Eye, File, FileImage, FileText, Folder, FolderOpen, Link2, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, Loading, Modal, SearchInput } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import type { ExplorerDirectory, ExplorerEntry, ExplorerPreview, FileExplorerProps } from './types'
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
  if (/\.(png|jpe?g|gif|webp|bmp)$/i.test(entry.extension)) return <FileImage size={27} strokeWidth={1.65}/>
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
  const [preview, setPreview] = useState<ExplorerPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const listing = useAsync<ExplorerDirectory>(() => window.fluxoDre.explorador.list(rootId, relativePath), [rootId, relativePath])
  const breadcrumbs = useMemo(() => breadcrumbParts(relativePath, rootLabel), [relativePath, rootLabel])
  const items = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')
    if (!query) return listing.data?.items || []
    return (listing.data?.items || []).filter((item) => item.name.toLocaleLowerCase('pt-BR').includes(query))
  }, [listing.data, search])

  const showPreview = async (entry: ExplorerEntry) => {
    setPreview(null)
    setPreviewError(null)
    setPreviewLoading(true)
    try { setPreview(await window.fluxoDre.explorador.preview(rootId, entry.relativePath)) }
    catch (error) { setPreviewError(error instanceof Error ? error.message : String(error)) }
    finally { setPreviewLoading(false) }
  }

  const openEntry = async (entry: ExplorerEntry) => {
    if (!entry.canOpen) return
    if (entry.kind === 'folder') {
      setSearch('')
      setRelativePath(entry.relativePath)
      return
    }
    await showPreview(entry)
  }

  const closePreview = () => { setPreview(null); setPreviewError(null); setPreviewLoading(false) }
  const openCurrentInSystem = () => window.fluxoDre.explorador.open(rootId, relativePath)

  return <section className={`file-explorer ${className}`.trim()} aria-label={title}>
    <div className="file-explorer-toolbar">
      <div className="file-explorer-heading">
        <div className="file-explorer-title-line"><strong>{title}</strong><span>Área gerenciada</span></div>
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
        <button className="file-explorer-item-main" type="button" onClick={() => openEntry(entry)} disabled={!entry.canOpen} title={entry.kind === 'folder' ? `Abrir ${entry.name}` : entry.canOpen ? `Visualizar ${entry.name}` : 'Atalho não disponível'}>
          <span className="file-explorer-item-icon">{entryIcon(entry)}</span>
          <span className="file-explorer-item-copy"><strong>{entry.name}</strong><small>{entry.kind === 'folder' ? 'Pasta' : entry.kind === 'link' ? 'Atalho simbólico bloqueado' : [formatSize(entry.size), formatModified(entry.modifiedAt)].filter(Boolean).join(' · ')}</small></span>
          {entry.kind === 'file' && entry.canOpen && <Eye className="file-explorer-external" size={15}/>} 
        </button>
        {entry.kind === 'folder' && entry.canOpen && <button className="file-explorer-system-action" type="button" onClick={() => window.fluxoDre.explorador.open(rootId, entry.relativePath)}><ExternalLink size={13}/> Abrir no Windows</button>}
      </article>)}
    </div> : <div className="file-explorer-state"><Folder size={34}/><strong>{search ? 'Nenhum item encontrado' : emptyTitle}</strong><p>{search ? 'Altere a busca para ver outros arquivos desta pasta.' : 'Quando houver arquivos ou subpastas, eles aparecerão aqui automaticamente.'}</p></div>}

    <Modal open={previewLoading || !!preview || !!previewError} title={preview?.name || 'Visualizar arquivo'} onClose={closePreview} size="xl">
      {previewLoading ? <Loading label="Preparando visualização..."/> : previewError ? <div className="file-explorer-preview-state"><strong>Não foi possível visualizar</strong><p>{previewError}</p></div> : preview && <>
        <div className="file-explorer-preview-meta">
          <div><span>Nome</span><strong>{preview.name}</strong></div>
          <div><span>Tamanho</span><strong>{formatSize(preview.size)}</strong></div>
          <div><span>Tipo</span><strong>{preview.extension || 'arquivo'}</strong></div>
          <div><span>Modificado</span><strong>{formatModified(preview.modifiedAt)}</strong></div>
          <div className="file-explorer-preview-path"><span>Caminho relativo</span><strong>{preview.relativePath}</strong></div>
        </div>
        <div className="file-explorer-preview-stage">
          {preview.previewKind === 'image' && preview.dataUrl ? <img src={preview.dataUrl} alt={preview.name}/> : preview.previewKind === 'pdf' && preview.dataUrl ? <iframe src={preview.dataUrl} title={`Prévia de ${preview.name}`}/> : <div className="file-explorer-preview-state"><FileText size={36}/><strong>Prévia interna indisponível</strong><p>{preview.previewBlockedReason === 'size' ? 'O arquivo é grande demais para a visualização interna. Abra no Windows para consultá-lo.' : 'Este tipo de arquivo ainda é aberto pelo aplicativo padrão do Windows.'}</p></div>}
        </div>
        <div className="form-actions"><Button variant="secondary" onClick={closePreview}>Fechar</Button><Button icon={<ExternalLink size={15}/>} onClick={() => window.fluxoDre.explorador.open(rootId, preview.relativePath)}>Abrir no Windows</Button></div>
      </>}
    </Modal>
  </section>
}
