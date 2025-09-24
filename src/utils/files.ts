import type { DocumentType } from '@/types/training'

export const getFileIcon = (documentType: DocumentType): string => {
  const iconMap: Record<DocumentType, string> = {
    ID_CARD: 'ri-id-card-line',
    CV: 'ri-file-text-line',
    COVER_LETTER: 'ri-file-text-line',
    DIPLOMA: 'ri-file-paper-line',
    PROOF_OF_ADDRESS: 'ri-home-line',
    OTHER: 'ri-file-line',
  }

  return iconMap[documentType]
}

export const getDocumentTypeLabel = (documentType: DocumentType): string => {
  const labelMap: Record<DocumentType, string> = {
    ID_CARD: 'Pièce d\'identité',
    CV: 'CV',
    COVER_LETTER: 'Lettre de motivation',
    DIPLOMA: 'Diplôme',
    PROOF_OF_ADDRESS: 'Justificatif de domicile',
    OTHER: 'Autre document',
  }

  return labelMap[documentType]
}

export const downloadAttachment = async (filePath: string) => {
  try {
    const response = await fetch(filePath)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filePath.split('/').pop() || 'document'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
  catch (error) {
    console.error('Erreur lors du téléchargement:', error)
  }
}
