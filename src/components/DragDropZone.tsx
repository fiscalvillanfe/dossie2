import { useState, useRef, DragEvent } from 'react'
import { Upload, FileText, X } from 'lucide-react'

type Props = {
  onFilesDropped: (files: File[]) => void
  children: React.ReactNode
}

export default function DragDropZone({ onFilesDropped, children }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFiles, setDraggedFiles] = useState<File[]>([])
  const dragCounter = useRef(0)

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(false)
    dragCounter.current = 0

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf')
      setDraggedFiles(files)
      if (files.length > 0) {
        // Não chama onFilesDropped imediatamente, mostra preview primeiro
      }
    }
  }

  const confirmDrop = () => {
    onFilesDropped(draggedFiles)
    setDraggedFiles([])
  }

  const cancelDrop = () => {
    setDraggedFiles([])
  }

  return (
    <div
      className="relative w-full h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fadeInScale">
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-2 border-dashed border-blue-400/60 rounded-3xl p-12 text-center max-w-md mx-4 backdrop-blur-md">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Solte os PDFs aqui</h3>
            <p className="text-blue-200/80 text-sm">
              Arquivos serão automaticamente organizados nos campos correspondentes
            </p>
          </div>
        </div>
      )}

      {/* Files Preview Modal */}
      {draggedFiles.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fadeInScale">
          <div className="bg-slate-800 border border-slate-600/50 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Arquivos Detectados</h3>
                <p className="text-sm text-slate-400">Confirme para adicionar aos campos</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {draggedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600/40">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelDrop}
                className="btn btn-ghost flex-1"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={confirmDrop}
                className="btn btn-primary flex-1"
              >
                <Upload className="w-4 h-4" />
                Adicionar Arquivos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}