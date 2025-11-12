import type { PersonType } from '../types'
import { User, Building2, Info } from 'lucide-react'

type Props = {
  value: PersonType
  onChange: (v: PersonType) => void
}

export default function PersonToggle({ value, onChange }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Tipo de Dossiê</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            className={`btn ${value==='pf' ? 'btn-primary ring-soft' : 'btn-ghost'} justify-start text-left p-4 h-auto`}
            onClick={() => onChange('pf')}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${value==='pf' ? 'bg-white/20' : 'bg-slate-600/30'}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Pessoa Física</div>
                <div className="text-xs opacity-70">Documentos individuais</div>
              </div>
            </div>
          </button>
          
          <button
            className={`btn ${value==='pj' ? 'btn-primary ring-soft' : 'btn-ghost'} justify-start text-left p-4 h-auto`}
            onClick={() => onChange('pj')}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${value==='pj' ? 'bg-white/20' : 'bg-slate-600/30'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Pessoa Jurídica</div>
                <div className="text-xs opacity-70">Documentos empresariais</div>
              </div>
            </div>
          </button>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-200">Informações importantes:</p>
              <div className="text-xs text-blue-100/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span>• Campos</span>
                  <span className="tag tag-required">Obrigatório</span>
                  <span>precisam ser anexados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>• Campos</span>
                  <span className="tag tag-optional">Opcional</span>
                  <span>podem ser pulados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
