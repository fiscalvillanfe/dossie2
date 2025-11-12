import { CheckCircle, Clock, AlertCircle, FileText, Trash2 } from 'lucide-react'

type Props = {
  totalFields: number
  uploadedFields: number
  requiredFields: number
  uploadedRequired: number
  files: Record<string, File | null>
  onRemoveFile: (key: string) => void
}

export default function ProgressDashboard({ 
  totalFields, 
  uploadedFields, 
  requiredFields, 
  uploadedRequired, 
  files,
  onRemoveFile
}: Props) {
  const completionPercentage = Math.round((uploadedFields / totalFields) * 100)
  const requiredPercentage = Math.round((uploadedRequired / requiredFields) * 100)
  const isComplete = uploadedRequired === requiredFields

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Dashboard de Progresso</h2>
      </div>
      
      <div className="space-y-6">
        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-200">Documentos Obrigatórios</span>
              <span className="text-sm text-slate-400">{uploadedRequired}/{requiredFields}</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isComplete ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
                style={{ width: `${requiredPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-200">Progresso Total</span>
              <span className="text-sm text-slate-400">{uploadedFields}/{totalFields}</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-3 rounded-xl border text-center transition-all duration-300 ${
            isComplete 
              ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200' 
              : 'bg-amber-500/10 border-amber-400/30 text-amber-200'
          }`}>
            {isComplete ? <CheckCircle className="w-5 h-5 mx-auto mb-1" /> : <Clock className="w-5 h-5 mx-auto mb-1" />}
            <p className="text-xs font-medium">
              {isComplete ? 'Completo' : 'Pendente'}
            </p>
          </div>
          
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-center text-blue-200">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs font-medium">{uploadedFields} Anexados</p>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-600/20 border border-slate-500/30 text-center text-slate-300">
            <AlertCircle className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs font-medium">{completionPercentage}% Completo</p>
          </div>
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFields > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Arquivos Anexados</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(files).map(([key, file]) => {
                if (!file) return null
                return (
                  <div key={key} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg border border-slate-600/40 group hover:bg-slate-600/30 transition-colors">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-200 truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onRemoveFile(key)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all duration-200"
                        title="Remover arquivo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}