import { useState, useEffect } from 'react'
import { FileText, Eye, X, Download, Calendar, HardDrive, FileType } from 'lucide-react'

type Props = {
  file: File | null
  isOpen: boolean
  onClose: () => void
}

type FileInfo = {
  name: string
  size: string
  type: string
  lastModified: string
  pages?: number
}

export default function PDFPreview({ file, isOpen, onClose }: Props) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (file && isOpen) {
      setIsLoading(true)
      loadFileInfo(file)
    } else {
      cleanup()
    }
  }, [file, isOpen])

  const loadFileInfo = async (file: File) => {
    try {
      // Informações básicas do arquivo
      const info: FileInfo = {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString('pt-BR'),
      }

      // Criar URL para preview
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Tentar extrair número de páginas (simulado - seria necessário uma lib como pdf-lib para real)
      try {
        const arrayBuffer = await file.arrayBuffer()
        const text = new TextDecoder().decode(arrayBuffer.slice(0, 1024))
        const pageMatch = text.match(/\/Count\s+(\d+)/)
        if (pageMatch) {
          info.pages = parseInt(pageMatch[1])
        }
      } catch (e) {
        // Fallback: simular baseado no tamanho (aproximação)
        info.pages = Math.max(1, Math.round(file.size / 50000))
      }

      setFileInfo(info)
    } catch (error) {
      console.error('Erro ao carregar informações do arquivo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const cleanup = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setFileInfo(null)
    setIsLoading(false)
  }

  useEffect(() => {
    return cleanup
  }, [])

  if (!isOpen || !file) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInScale">
      <div className="bg-slate-800 border border-slate-600/50 rounded-2xl max-w-4xl w-full h-[80vh] shadow-2xl flex flex-col animate-fadeInScale">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Preview do Documento</h3>
              <p className="text-sm text-slate-400 truncate max-w-md">{file.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Info Sidebar */}
          <div className="w-80 p-6 border-r border-slate-600/50 bg-slate-800/50">
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Informações do Arquivo</h4>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
                    <div className="h-6 bg-slate-600/50 rounded"></div>
                  </div>
                ))}
              </div>
            ) : fileInfo ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/40">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-slate-300">Nome do Arquivo</span>
                  </div>
                  <p className="text-sm text-slate-100 break-all">{fileInfo.name}</p>
                </div>

                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/40">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-slate-300">Tamanho</span>
                  </div>
                  <p className="text-sm text-slate-100">{fileInfo.size}</p>
                </div>

                {fileInfo.pages && (
                  <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/40">
                    <div className="flex items-center gap-2 mb-2">
                      <FileType className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-slate-300">Páginas</span>
                    </div>
                    <p className="text-sm text-slate-100">{fileInfo.pages} página(s)</p>
                  </div>
                )}

                <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-medium text-slate-300">Modificado</span>
                  </div>
                  <p className="text-sm text-slate-100">{fileInfo.lastModified}</p>
                </div>

                <button
                  onClick={() => {
                    const url = URL.createObjectURL(file)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = file.name
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="w-full btn btn-primary"
                >
                  <Download className="w-4 h-4" />
                  Baixar Arquivo
                </button>
              </div>
            ) : null}
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Carregando preview...</p>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="h-full bg-slate-900/50 rounded-xl border border-slate-600/40 overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                  onError={() => {
                    // Fallback se não conseguir mostrar o PDF
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Não foi possível carregar o preview</p>
                  <p className="text-xs text-slate-500 mt-2">O arquivo pode estar corrompido ou em formato não suportado</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-600/50 bg-slate-800/50">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400">
              Use as setas do teclado ou scroll para navegar no documento
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="btn btn-ghost"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}