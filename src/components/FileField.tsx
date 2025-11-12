import { DocField } from '../types'
import { FileText, Upload, Check, Eye } from 'lucide-react'
import { useState } from 'react'

type Props = {
  field: DocField
  onFile: (key: string, file: File | null) => void
  onPreview?: (file: File) => void
}

export default function FileField({ field, onFile, onPreview }: Props) {
  const id = field.key
  const [isUploading, setIsUploading] = useState(false)
  const [hasFile, setHasFile] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      setIsUploading(true)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simular upload
      setHasFile(true)
      setCurrentFile(file)
      setIsUploading(false)
    } else {
      setHasFile(false)
      setCurrentFile(null)
    }
    onFile(field.key, file)
  }

  return (
    <div className={`field ${isUploading ? 'uploading' : ''} ${hasFile ? 'success' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <label htmlFor={id} className="field-label cursor-pointer">
            {field.label}
          </label>
        </div>
        <span className={`tag ${field.required ? 'tag-required' : 'tag-optional'}`}>
          {field.required ? 'Obrigatório' : 'Opcional'}
        </span>
      </div>
      
      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-medium inline-flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> 
            PDF Only
          </div>
          {hasFile && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-medium inline-flex items-center gap-1.5 animate-fadeInScale">
              <Check className="w-3.5 h-3.5" /> 
              Anexado
            </div>
          )}
          {hasFile && currentFile && onPreview && (
            <button
              onClick={() => onPreview(currentFile)}
              className="px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-blue-500/25 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> 
              Visualizar
            </button>
          )}
        </div>
        
        <label htmlFor={id} className="block cursor-pointer">
          <input
            id={id}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="sr-only"
            disabled={isUploading}
          />
          <div className={`upload-area flex items-center justify-center gap-3 p-4 border-2 border-dashed rounded-xl transition-all duration-200 group ${
            isUploading ? 'border-blue-400/60 bg-blue-500/10' : 
            hasFile ? 'border-emerald-400/60 bg-emerald-500/5' :
            'border-slate-500/50 hover:border-blue-400/60 hover:bg-blue-500/5'
          }`}>
            {isUploading ? (
              <>
                <Upload className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-sm font-medium text-blue-300">
                  Processando arquivo...
                </span>
              </>
            ) : hasFile ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                  Arquivo carregado com sucesso
                </span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-blue-300 transition-colors">
                  Selecionar arquivo PDF
                </span>
              </>
            )}
          </div>
        </label>
      </div>
    </div>
  )
}
