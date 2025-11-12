import { Shield, Lock, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-8 pt-8 border-t border-slate-600/30">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">100% Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Lock className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Processamento Local</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="font-medium">Alta Performance</span>
          </div>
        </div>
        
        <div className="text-center lg:text-right">
          <p className="text-xs text-slate-400 font-medium">
            © 2025 Montador de Dossiê Pro
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Sistema corporativo de organização de documentos
          </p>
        </div>
      </div>
    </footer>
  )
}
