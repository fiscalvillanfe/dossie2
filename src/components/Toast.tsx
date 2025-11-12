import { useEffect, useState } from 'react'

export default function Toast({ text }: { text: string }) {
  const [show, setShow] = useState(!!text)
  useEffect(() => { setShow(!!text) }, [text])
  if (!show) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm">
      {text}
    </div>
  )
}
