type Props = {
  open: boolean
  title: string
  message: string
  items?: string[]
  onCancel: () => void
  onConfirm?: () => void
  confirmLabel?: string
}

export default function Modal({ open, title, message, items = [], onCancel, onConfirm, confirmLabel = 'Continuar' }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="card w-[min(460px,92vw)]">
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-sm text-white/70 mb-2">{message}</p>
        {items.length > 0 && (
          <ul className="list-disc ml-5 text-sm text-white/90 space-y-1 mb-3">
            {items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        )}
        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onCancel}>Voltar e anexar</button>
          {onConfirm && (
            <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
          )}
        </div>
      </div>
    </div>
  )
}
