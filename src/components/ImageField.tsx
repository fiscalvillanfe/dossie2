import { DocField } from '../types'
import { Image as ImageIcon } from 'lucide-react'

type Props = {
  field: DocField
  onFiles: (key: string, files: File[]) => void
}

export default function ImageField({ field, onFiles }: Props) {
  const id = field.key

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? [])
      .filter(f => /image\/(png|jpe?g)/i.test(f.type))
      .slice(0, field.maxImages ?? 10)
    onFiles(field.key, list)
  }

  return (
    <div className="field">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">{field.label}</span>
        <span className={`tag ${field.required ? 'tag-required' : 'tag-optional'}`}>{field.required ? 'Obrigatório' : 'Opcional'}</span>
      </div>
      <label htmlFor={id} className="sr-only">{field.label}</label>
      <div className="flex items-center gap-2">
        <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 text-xs inline-flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5" /> Imagem (PNG/JPG)
        </div>
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={handleChange}
          className="file:mr-2 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-blue-500/20 file:text-white file:text-xs file:cursor-pointer file:hover:bg-blue-500/30 text-xs text-white/70 border border-white/20 rounded-full px-2 py-1 w-full"
        />
        {field.maxImages && (
          <span className="text-xs text-white/50">até {field.maxImages} imagens</span>
        )}
      </div>
    </div>
  )
}
