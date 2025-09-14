import Swal from 'sweetalert2'
import type { SweetAlertOptions } from 'sweetalert2'

/**
 * Affiche une boîte de confirmation centralisée avant toute action critique (POST, PUT, DELETE).
 * @param options - Personnalisation du message et des boutons.
 * @returns Promise<boolean> true si confirmé, false sinon
 */
type HttpMethod = 'post' | 'put' | 'delete'

const defaultMessages: Record<HttpMethod, { title: string; text: string }> = {
  post: {
    title: 'Êtes-vous sûr ?',
    text: 'Souhaitez-vous vraiment continuer et finaliser cet enregistrement ?',
  },
  put: {
    title: 'Êtes-vous sûr ?',
    text: 'Souhaitez-vous vraiment modifier ces données ?',
  },
  delete: {
    title: 'Confirmer la suppression',
    text: 'Souhaitez-vous vraiment supprimer cet élément ?',
  },
}

type ConfirmActionOptions = Omit<SweetAlertOptions, 'icon'> & {
  method?: HttpMethod
  title?: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
}

export function confirmAction(options?: ConfirmActionOptions): Promise<boolean> {
  const method = (options?.method || 'post') as HttpMethod
  const msg = defaultMessages[method]

  return Swal.fire({
    title: options?.title || msg.title,
    text: options?.text || msg.text,
    showCancelButton: true,
    confirmButtonText: options?.confirmButtonText || 'Continuer',
    cancelButtonText: options?.cancelButtonText || 'Annuler',
    reverseButtons: true,
    focusCancel: true,
    ...options,
  }).then(result => !!result.isConfirmed)
}
