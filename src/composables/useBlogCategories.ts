import { ref, computed } from 'vue'
import { blogService } from '@/services/api/blog'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

export const useBlogCategories = () => {
  // States
  const categories = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const totalCategories = computed(() => categories.value.length)

  const activeCategories = computed(() => {
    return categories.value.filter(cat => cat.status === 'active' || !cat.status).length
  })

  const newCategoriesThisWeek = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return categories.value.filter(cat => {
      const catDate = new Date(cat.created_at)
      return catDate >= oneWeekAgo
    }).length
  })

  const mostUsedCategory = computed(() => {
    // Pour l'instant, on retourne la première catégorie
    // Dans une vraie implémentation, on calculerait l'usage réel
    return categories.value[0] || null
  })

  // Methods
  const loadCategories = async () => {
    try {
      isLoading.value = true
      error.value = null
      const res = await blogService.getCategories()
      
      if (Array.isArray((res as any).data)) {
        categories.value = (res as any).data
      } else if (Array.isArray((res as any).data?.data)) {
        categories.value = (res as any).data.data
      } else {
        categories.value = []
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories:', err)
      error.value = 'Erreur lors du chargement des catégories'
      showToast({
        message: 'Erreur lors du chargement des catégories',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (data: any) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await blogService.createCategory(data)
      
      showToast({
        message: 'Catégorie créée avec succès',
        type: 'success'
      })

      // Recharger les catégories
      await loadCategories()
      return response
    } catch (err: any) {
      console.error('Erreur lors de la création de la catégorie:', err)
      error.value = 'Erreur lors de la création de la catégorie'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la création de la catégorie',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (id: number, data: any) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await blogService.updateCategory(id, data)
      
      showToast({
        message: 'Catégorie mise à jour avec succès',
        type: 'success'
      })

      // Recharger les catégories
      await loadCategories()
      return response
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la catégorie:', err)
      error.value = 'Erreur lors de la mise à jour de la catégorie'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (category: any) => {
    const confirmed = await confirmAction({
      title: 'Êtes-vous sûr ?',
      html: `Souhaitez-vous réellement supprimer la catégorie <b>${category.title}</b> ? Cette action est irréversible.`,
      cancelButtonText: `<span style="color:white">Annuler</span>`,
      confirmButtonText: `<span style="color:white">Supprimer</span>`,
      confirmButtonColor: "#b92858ff",
      cancelButtonColor: "#FF4C51",
      customClass: {
        confirmButton: 'swal2-confirm-white',
        cancelButton: 'swal2-cancel-white',
      },
    })

    if (confirmed) {
      try {
        isLoading.value = true
        error.value = null
        await blogService.deleteCategory(category.id)
        
        showToast({
          message: 'Catégorie supprimée avec succès',
          type: 'success'
        })

        // Recharger les catégories
        await loadCategories()
      } catch (err: any) {
        console.error('Erreur lors de la suppression:', err)
        showToast({
          message: 'Erreur lors de la suppression de la catégorie',
          type: 'error'
        })
        throw err
      } finally {
        isLoading.value = false
      }
    }
  }

  const getCategoryById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await blogService.getCategoryById(id)
      return response
    } catch (err: any) {
      console.error('Erreur lors du chargement de la catégorie:', err)
      error.value = 'Erreur lors du chargement de la catégorie'
      showToast({
        message: 'Erreur lors du chargement de la catégorie',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Fonction pour générer un slug à partir du titre
  const generateSlug = (title: string): string => {
    if (!title) return ''
    
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garde seulement les lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/-+/g, '-') // Supprime les tirets multiples
      .trim()
  }

  // Fonction pour formater une date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return {
    // States
    categories,
    isLoading,
    error,

    // Computed
    totalCategories,
    activeCategories,
    newCategoriesThisWeek,
    mostUsedCategory,

    // Methods
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    generateSlug,
    formatDate,
  }
}
