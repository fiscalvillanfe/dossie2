import { useState, useEffect } from 'react'
import { History, Download, Trash2, Calendar, User, Building2 } from 'lucide-react'

type HistoryEntry = {
  id: string
  filename: string
  personType: 'pf' | 'pj'
  documentsCount: number
  generatedAt: string
  size?: string
}

type Props = {
  onRegisterAddFunction: (fn: (entry: Omit<HistoryEntry, 'id' | 'generatedAt'>) => void) => void
}

export default function DossierHistory({ onRegisterAddFunction }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem('dossier-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveHistory = (newHistory: HistoryEntry[]) => {
    setHistory(newHistory)
    localStorage.setItem('dossier-history', JSON.stringify(newHistory))
  }

  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'generatedAt'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      generatedAt: new Date().toISOString()
    }
    const updatedHistory = [newEntry, ...history.slice(0, 9)] // Manter apenas 10 mais recentes
    saveHistory(updatedHistory)
  }

  const removeFromHistory = (id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id)
    saveHistory(updatedHistory)
  }

  const clearHistory = () => {
    saveHistory([])
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Expor a função para o componente pai
  useEffect(() => {
    onRegisterAddFunction(addToHistory)
  }, [])

  if (history.length === 0) return null

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="card-title flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico Recente
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isOpen ? 'Ocultar' : `${history.length} dossiês`}
            </button>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                title="Limpar histórico"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/40 group hover:bg-slate-600/30 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  entry.personType === 'pf' 
                    ? 'bg-blue-500/20 text-blue-300' 
                    : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {entry.personType === 'pf' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-200 truncate">{entry.filename}</p>
                    <span className="px-2 py-0.5 bg-slate-600/50 text-xs text-slate-300 rounded-full">
                      {entry.documentsCount} docs
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(entry.generatedAt)}
                    </span>
                    {entry.size && (
                      <span>{entry.size}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removeFromHistory(entry.id)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  title="Remover do histórico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}