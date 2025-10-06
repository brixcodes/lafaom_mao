import { ref, computed } from 'vue'
import { blogService } from '@/services/api/blog'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

export const useBlogArticles = () => {
  // States
  const posts = ref<any[]>([])
  const categories = ref<any[]>([])
  const availableTags = ref<string[]>([])
  const isLoading = ref(false)
  const categoriesLoading = ref(false)
  const tagsLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const totalPosts = computed(() => posts.value.length)

  const publishedCount = computed(() => {
    return posts.value.filter(post => post.published_at && post.published_at !== null).length
  })

  const draftCount = computed(() => {
    return posts.value.filter(post => !post.published_at || post.published_at === null).length
  })

  const recentArticlesCount = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return posts.value.filter(post => {
      const postDate = new Date(post.created_at)
      return postDate >= oneWeekAgo
    }).length
  })

  // Methods
  const loadPosts = async () => {
    try {
      isLoading.value = true
      error.value = null
      const res = await blogService.getPosts()
      
      if (res && res.data && Array.isArray(res.data)) {
        posts.value = res.data
      } else {
        posts.value = []
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des articles:', err)
      error.value = 'Erreur lors du chargement des articles'
      showToast({
        message: 'Erreur lors du chargement des articles',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const loadCategories = async () => {
    try {
      categoriesLoading.value = true
      const res = await blogService.getCategories()
      
      if (res && res.data && Array.isArray(res.data)) {
        categories.value = res.data
      } else {
        categories.value = []
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories:', err)
      categories.value = []
    } finally {
      categoriesLoading.value = false
    }
  }

  const loadTags = async () => {
    try {
      tagsLoading.value = true
      const tags = await blogService.getAllTags()
      availableTags.value = tags
    } catch (err: any) {
      console.error('Erreur lors du chargement des tags:', err)
      availableTags.value = []
    } finally {
      tagsLoading.value = false
    }
  }

  const createPost = async (data: any) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await blogService.createPost(data)
      
      showToast({
        message: 'Article créé avec succès',
        type: 'success'
      })

      // Recharger les articles
      await loadPosts()
      return response
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'article:', err)
      error.value = 'Erreur lors de la création de l\'article'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la création de l\'article',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updatePost = async (id: number, data: any) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await blogService.updatePost(id, data)
      
      showToast({
        message: 'Article mis à jour avec succès',
        type: 'success'
      })

      // Recharger les articles
      await loadPosts()
      return response
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de l\'article:', err)
      error.value = 'Erreur lors de la mise à jour de l\'article'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la mise à jour de l\'article',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deletePost = async (post: any) => {
    const confirmed = await confirmAction({
      title: 'Êtes-vous sûr ?',
      html: `Souhaitez-vous réellement supprimer l'article <b>${post.title}</b> ? Cette action est irréversible.`,
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
        await blogService.deletePost(post.id)
        
        showToast({
          message: 'Article supprimé avec succès',
          type: 'success'
        })

        // Recharger les articles
        await loadPosts()
      } catch (err: any) {
        console.error('Erreur lors de la suppression:', err)
        showToast({
          message: 'Erreur lors de la suppression de l\'article',
          type: 'error'
        })
        throw err
      } finally {
        isLoading.value = false
      }
    }
  }

  const publishPost = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      await blogService.publishPost(id)
      
      showToast({
        message: 'Article publié avec succès',
        type: 'success'
      })

      // Recharger les articles
      await loadPosts()
    } catch (err: any) {
      console.error('Erreur lors de la publication:', err)
      showToast({
        message: 'Erreur lors de la publication de l\'article',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const unpublishPost = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      await blogService.unpublishPost(id)
      
      showToast({
        message: 'Article dépublié avec succès',
        type: 'success'
      })

      // Recharger les articles
      await loadPosts()
    } catch (err: any) {
      console.error('Erreur lors de la dépublication:', err)
      showToast({
        message: 'Erreur lors de la dépublication de l\'article',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getPostById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await blogService.getPostById(id)
      return response
    } catch (err: any) {
      console.error('Erreur lors du chargement de l\'article:', err)
      error.value = 'Erreur lors du chargement de l\'article'
      showToast({
        message: 'Erreur lors du chargement de l\'article',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Fonction pour formater une date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Fonction pour obtenir les articles récents
  const getRecentArticlesCount = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return posts.value.filter(post => {
      const postDate = new Date(post.created_at)
      return postDate >= oneWeekAgo
    }).length
  }

  return {
    // States
    posts,
    categories,
    availableTags,
    isLoading,
    categoriesLoading,
    tagsLoading,
    error,

    // Computed
    totalPosts,
    publishedCount,
    draftCount,
    recentArticlesCount,

    // Methods
    loadPosts,
    loadCategories,
    loadTags,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    getPostById,
    formatDate,
    getRecentArticlesCount,
  }
}
