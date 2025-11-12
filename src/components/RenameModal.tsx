import { useState, useEffect } from 'react'
import { FileText, Edit3 } from 'lucide-react'

type Props = {
  open: boolean
  defaultName: string
  onCancel: () => void
  onConfirm: (filename: string) => void
}

export default function RenameModal({ open, defaultName, onCancel, onConfirm }: Props) {
  const [filename, setFilename] = useState('')

  useEffect(() => {
    if (open) {
      setFilename(defaultName)
    }
  }, [open, defaultName])

  if (!open) return null

  const handleConfirm = () => {
    const finalName = filename.trim() || defaultName
    onConfirm(finalName)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInScale">
      <div className="bg-slate-800 border border-slate-600/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fadeInScale">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Renomear Dossiê</h3>
            <p className="text-sm text-slate-400">Personalize o nome do seu arquivo</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-slate-200 mb-2">
              Nome do arquivo:
            </label>
            <div className="relative">
              <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={defaultName}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200"
                autoFocus
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              <strong>Nome padrão:</strong> {defaultName}
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-100/80">
                <p className="font-medium text-blue-200">Informação:</p>
                <p>O arquivo será salvo automaticamente como PDF na sua pasta de Downloads.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="btn btn-ghost flex-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="btn btn-primary flex-1"
          >
            <FileText className="w-4 h-4" />
            Gerar Dossiê
          </button>
        </div>
      </div>
    </div>
  )
}