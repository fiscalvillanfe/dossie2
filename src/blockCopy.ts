// bloqueia copiar, colar, seleção e botão direito
document.addEventListener('DOMContentLoaded', () => {
  const block = (e: Event) => e.preventDefault()

  document.addEventListener('copy', block)
  document.addEventListener('cut', block)
  document.addEventListener('paste', block)
  document.addEventListener('contextmenu', block)
  document.addEventListener('selectstart', block)

  // camada extra pra prevenir highlight de texto
  document.body.style.userSelect = 'none'
  document.body.style.webkitUserSelect = 'none'
  ;(document.body.style as any).msUserSelect = 'none'
  ;(document.body.style as any).mozUserSelect = 'none'
})
