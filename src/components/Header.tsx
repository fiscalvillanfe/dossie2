import { Layers, FileText } from 'lucide-react'

export default function Header() {
  return (
    <header className="mb-8 animate-fadeInUp">
      <div className="flex items-center gap-6">
        <div className="relative animate-fadeInScale">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-bounce">
            <FileText className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex flex-col animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Montador de Dossiê
            </h1>
            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 rounded-full border border-blue-400/30 animate-pulse">
              Pro
            </span>
          </div>
          <p className="text-slate-300 text-base font-medium mt-2 tracking-wide">
            Sistema Profissional de Organização e Compilação de Documentos
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              Sistema Online
            </div>
            <div className="text-xs text-slate-400">•</div>
            <div className="text-xs text-slate-400 font-medium">
              Processamento Local Seguro
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
