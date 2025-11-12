import { useMemo, useState, useCallback } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import Header from './components/Header'
import Footer from './components/Footer'
import PersonToggle from './components/PersonToggle'
import SectionCard from './components/SectionCard'
import FileField from './components/FileField'
import ImageField from './components/ImageField'
import Modal from './components/Modal'
import RenameModal from './components/RenameModal'
import Toast from './components/Toast'
import ProgressDashboard from './components/ProgressDashboard'
import DragDropZone from './components/DragDropZone'
import ThemeSwitcher from './components/ThemeSwitcher'
import DossierHistory from './components/DossierHistory'
import PDFPreview from './components/PDFPreview'
import type { DocField, PersonType } from './types'
import { mergePdfParts, downloadBlob, imagesToPdf } from './utils/pdf'

const FIELDS_PF: DocField[] = [
  { key: 'pf_termo_titularidade', label: 'I. Termo de titularidade (quando for o caso)', required: false, kind: 'pdf' },
  { key: 'pf_doc_identificacao', label: 'II. Documento de identificação', required: true, kind: 'pdf' },
  { key: 'pf_consulta_doc', label: 'III. Consulta do documento (quando disponível)', required: false, kind: 'pdf' },
  { key: 'pf_cpf_consulta', label: 'V. Consulta do CPF do titular', required: true, kind: 'pdf' },
  { key: 'pf_espelho_caepf', label: 'VI. Espelho do CAEPF/CEI/PIS/CNO (quando preenchido no termo de titularidade)', required: false, kind: 'pdf' },
]

const FIELDS_PJ: DocField[] = [
  { key: 'pj_termo_titularidade', label: 'I. Termo de titularidade (quando for o caso)', required: false, kind: 'pdf' },
  { key: 'pj_cartao_cnpj', label: 'II. Cartão CNPJ', required: true, kind: 'pdf' },
  { key: 'pj_ato_constitutivo', label: 'III. Ato constitutivo da empresa', required: true, kind: 'pdf' },
  { key: 'pj_consulta_ato', label: 'III-b. Consulta do ATO (imagens – 1 ou 2 páginas)', required: false, kind: 'images', maxImages: 2 },
  { key: 'pj_doc_representante', label: 'IV. Documento de identificação do representante legal', required: true, kind: 'pdf' },
  { key: 'pj_procuracao', label: 'V. Procuração (quando for o caso)', required: false, kind: 'pdf' },
  { key: 'pj_consulta_doc', label: 'VI. Consulta do documento (quando disponível)', required: false, kind: 'pdf' },
  { key: 'pj_cpf_consulta', label: 'VII. Consulta do CPF do representante legal', required: true, kind: 'pdf' },
  { key: 'pj_espelho_caepf', label: 'VIII. Espelho do CAEPF/CEI/PIS/CNO/TÍTULO (quando preenchido no termo de titularidade)', required: false, kind: 'pdf' },
]

export default function App() {
  const [person, setPerson] = useState<PersonType>('pf')
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [images, setImages] = useState<Record<string, File[]>>({})
  const [toast, setToast] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [defaultFilename, setDefaultFilename] = useState('')
  const [addToHistory, setAddToHistory] = useState<((entry: any) => void) | null>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const fields = useMemo(() => person === 'pf' ? FIELDS_PF : FIELDS_PJ, [person])

  // Calcular progresso
  const progressStats = useMemo(() => {
    const totalFields = fields.length
    const requiredFields = fields.filter(f => f.required).length
    const uploadedFields = Object.values(files).filter(Boolean).length + Object.values(images).filter(arr => arr.length > 0).length
    const uploadedRequired = fields.filter(f => f.required && (f.kind === 'pdf' ? files[f.key] : images[f.key]?.length > 0)).length

    return {
      totalFields,
      requiredFields,
      uploadedFields,
      uploadedRequired
    }
  }, [fields, files, images])

  function generateDefaultFilename() {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const mi = String(now.getMinutes()).padStart(2, '0')
    return `dossie-${person === 'pf' ? 'pessoa-fisica' : 'pessoa-juridica'}-${yyyy}${mm}${dd}-${hh}${mi}.pdf`
  }

  function setFile(key: string, file: File | null) {
    setFiles(prev => ({ ...prev, [key]: file }))
  }

  function setImageList(key: string, list: File[]) {
    setImages(prev => ({ ...prev, [key]: list }))
  }

  function removeFile(key: string) {
    setFiles(prev => ({ ...prev, [key]: null }))
    setImages(prev => ({ ...prev, [key]: [] }))
  }

  function previewFileHandler(file: File) {
    setPreviewFile(file)
    setShowPreview(true)
  }

  const handleFilesDropped = useCallback((droppedFiles: File[]) => {
    // Lógica simples: adicionar aos primeiros campos vazios
    const emptyFields = fields.filter(f => f.kind === 'pdf' && !files[f.key])
    
    droppedFiles.forEach((file, index) => {
      if (emptyFields[index]) {
        setFile(emptyFields[index].key, file)
      }
    })

    if (droppedFiles.length > 0) {
      setToast(`${droppedFiles.length} arquivo(s) adicionado(s)`)
      setTimeout(() => setToast(''), 2000)
    }
  }, [fields, files])

  function splitMissing() {
    const reqMissing: string[] = []
    const optMissing: string[] = []
    for (const f of fields) {
      const has = f.kind === 'pdf' ? !!files[f.key] : (images[f.key]?.length || 0) > 0
      if (!has) (f.required ? reqMissing : optMissing).push(f.label)
    }
    return { reqMissing, optMissing }
  }

  const [modal, setModal] = useState<{ open: boolean, mode: 'none'|'required'|'optional', items: string[] }>({ open: false, mode: 'none', items: [] })

  async function onGenerate() {
    if (isGenerating) return
    
    const { reqMissing, optMissing } = splitMissing()

    if (reqMissing.length) {
      setModal({ open: true, mode: 'required', items: reqMissing })
      return
    }

    if (optMissing.length) {
      setModal({ open: true, mode: 'optional', items: optMissing })
      return
    }

    // Mostrar modal de renomeação
    const filename = generateDefaultFilename()
    setDefaultFilename(filename)
    setShowRenameModal(true)
  }

  async function generate(skipOptional = false, customFilename?: string) {
    try {
      setIsGenerating(true)
      setToast('Processando documentos...')

      const parts: { source: File | Blob, label: string }[] = []

      for (const f of fields) {
        if (f.kind === 'pdf') {
          const file = files[f.key]
          if (file && (f.required || skipOptional || true)) {
            parts.push({ source: file, label: f.label })
          }
        } else {
          const list = images[f.key] || []
          if (list.length) {
            const blob = await imagesToPdf(list)
            parts.push({ source: blob, label: f.label })
          }
        }
      }

      if (!parts.length) {
        setModal({ open: true, mode: 'none', items: [] })
        setToast('')
        return
      }

      const blob = await mergePdfParts(parts)

      const filename = customFilename || generateDefaultFilename()
      downloadBlob(blob, filename)
      
      // Adicionar ao histórico
      if (addToHistory) {
        addToHistory({
          filename,
          personType: person,
          documentsCount: parts.length,
          size: `${(blob.size / 1024).toFixed(1)} KB`
        })
      }
      
      setToast('Dossiê gerado com sucesso.')
      setTimeout(() => setToast(''), 2000)
    } catch (e) {
      console.error(e)
      setToast('Erro ao gerar o dossiê. Verifique os arquivos.')
      setTimeout(() => setToast(''), 2500)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DragDropZone onFilesDropped={handleFilesDropped}>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="container-main">
            <div className="flex justify-between items-start mb-8">
              <Header />
              <ThemeSwitcher />
            </div>

            <div className="grid gap-6">
              <PersonToggle value={person} onChange={setPerson} />

              <ProgressDashboard
                totalFields={progressStats.totalFields}
                uploadedFields={progressStats.uploadedFields}
                requiredFields={progressStats.requiredFields}
                uploadedRequired={progressStats.uploadedRequired}
                files={files}
                onRemoveFile={removeFile}
              />

              <SectionCard title={person === 'pf' ? 'Dossiê - Pessoa Física' : 'Dossiê - Pessoa Jurídica'}>
                <div className="grid-responsive">
                  {fields.map(f => (
                    f.kind === 'pdf' ? (
                      <FileField key={f.key} field={f} onFile={setFile} onPreview={previewFileHandler} />
                    ) : (
                      <ImageField key={f.key} field={f} onFiles={setImageList} />
                    )
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Painel de Controle">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    className={`btn btn-primary flex-1 sm:flex-initial ${isGenerating ? 'loading' : ''}`} 
                    onClick={onGenerate}
                    disabled={isGenerating}
                  >
                    <FileText className={`w-4 h-4 btn-icon ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Gerando Dossiê...' : 'Gerar Dossiê Completo'}
                  </button>
                  <button 
                    className={`btn btn-ghost flex-1 sm:flex-initial ${isClearing ? 'loading' : ''}`} 
                    onClick={async () => {
                      setIsClearing(true)
                      await new Promise(resolve => setTimeout(resolve, 800))
                      setFiles({})
                      setImages({})
                      setIsClearing(false)
                    }}
                    disabled={isClearing}
                  >
                    <RefreshCw className={`w-4 h-4 btn-icon ${isClearing ? 'animate-spin' : ''}`} />
                    {isClearing ? 'Limpando...' : 'Limpar Dados'}
                  </button>
                </div>
              </SectionCard>

              <DossierHistory onRegisterAddFunction={setAddToHistory} />
            </div>

            <Footer />
          </div>
        </div>
      </div>

      <Modal
        open={modal.open && modal.mode==='required'}
        title="Documentos obrigatórios faltando"
        message="Anexe os documentos abaixo antes de gerar o dossiê:"
        items={modal.items}
        onCancel={() => setModal({ open: false, mode: 'none', items: [] })}
      />

      <Modal
        open={modal.open && modal.mode==='optional'}
        title="Documentos opcionais não anexados"
        message={`Os itens abaixo são opcionais ("quando houver"). Deseja continuar sem eles?`}
        items={modal.items}
        onCancel={() => setModal({ open: false, mode: 'none', items: [] })}
        onConfirm={async () => { 
          setModal({ open: false, mode: 'none', items: [] })
          // Mostrar modal de renomeação após confirmar documentos opcionais
          const filename = generateDefaultFilename()
          setDefaultFilename(filename)
          setShowRenameModal(true)
        }}
        confirmLabel="Continuar mesmo assim"
      />

      <Modal
        open={modal.open && modal.mode==='none'}
        title="Nenhum arquivo selecionado"
        message="Selecione pelo menos um documento para gerar o dossiê."
        onCancel={() => setModal({ open: false, mode: 'none', items: [] })}
      />

      <RenameModal
        open={showRenameModal}
        defaultName={defaultFilename}
        onCancel={() => setShowRenameModal(false)}
        onConfirm={async (filename) => {
          setShowRenameModal(false)
          await generate(false, filename)
        }}
      />

      <PDFPreview
        file={previewFile}
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false)
          setPreviewFile(null)
        }}
      />

      <Toast text={toast} />
    </DragDropZone>
  )
}
