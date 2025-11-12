import { PDFDocument } from 'pdf-lib'

export async function mergePdfParts(entries: { source: File | Blob, label: string }[]): Promise<Blob> {
  const merged = await PDFDocument.create()

  for (const e of entries) {
    const buf = await e.source.arrayBuffer()
    const pdf = await PDFDocument.load(buf)
    const pages = await merged.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(p => merged.addPage(p))
  }

  const bytes = await merged.save()
  return new Blob([bytes], { type: 'application/pdf' })
}

export async function imagesToPdf(images: File[]): Promise<Blob> {
  const pdf = await PDFDocument.create()
  for (const img of images) {
    const bytes = await img.arrayBuffer()
    const isPng = img.type.includes('png')
    const embedded = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes)
    const { width, height } = embedded.size()
    const page = pdf.addPage([width, height])
    page.drawImage(embedded, { x: 0, y: 0, width, height })
  }
  const out = await pdf.save()
  return new Blob([out], { type: 'application/pdf' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
