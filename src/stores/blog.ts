// Store Pinia pour le blog
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { blogService } from '@/services/api/blog'
import type {
  PostCategoryCreateInput,
  PostCategoryUpdateInput,
  PostCategoryOut,
  PostCategoryOutSuccess,
  PostCategoryListOutSuccess,
  PostCreateInput,
  PostUpdateInput,
  PostOut,
  PostOutSuccess,
  PostsPageOutSuccess,
  PostFilter,
  PostSectionCreateInput,
  PostSectionUpdateInput,
  PostSectionOut,
  PostSectionOutSuccess,
  PostSectionListOutSuccess,
} from '@/types/blog'
import type { BaseOutSuccess } from '@/types/index'

export const useBlogStore = defineStore('blog', () => {
  // State
  const categories = ref<PostCategoryOut[]>([])
  const posts = ref<PostOut[]>([])
  const publishedPosts = ref<PostOut[]>([])
  const currentPost = ref<PostOut | null>(null)
  const postSections = ref<PostSectionOut[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
  })

  // Getters
  const hasCategories = computed(() => categories.value.length > 0)
  const hasPosts = computed(() => posts.value.length > 0)
  const hasPublishedPosts = computed(() => publishedPosts.value.length > 0)
  const hasPostSections = computed(() => postSections.value.length > 0)

  // Actions
  // === CATEGORIES ===
  const fetchCategories = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostCategoryListOutSuccess = await blogService.getCategories()
      categories.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des catégories'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (categoryData: PostCategoryCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostCategoryOutSuccess = await blogService.createCategory(categoryData)
      categories.value.push(response.data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de la catégorie'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (categoryId: number, categoryData: PostCategoryUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostCategoryOutSuccess = await blogService.updateCategory(categoryId, categoryData)
      const index = categories.value.findIndex(cat => cat.id === categoryId)
      if (index !== -1) {
        categories.value[index] = response.data
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (categoryId: number) => {
    try {
      isLoading.value = true
      error.value = null
      await blogService.deleteCategory(categoryId)
      categories.value = categories.value.filter(cat => cat.id !== categoryId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de la catégorie'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === POSTS ===
  const fetchPosts = async (filter?: PostFilter) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostsPageOutSuccess = await blogService.getPosts(filter)
      posts.value = response.data
      pagination.value = {
        page: response.page,
        pageSize: response.number,
        total: response.total_number,
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des posts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPublishedPosts = async (filter?: PostFilter) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostsPageOutSuccess = await blogService.getPublishedPosts(filter)
      publishedPosts.value = response.data
      pagination.value = {
        page: response.page,
        pageSize: response.number,
        total: response.total_number,
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des posts publiés'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (postData: PostCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostOutSuccess = await blogService.createPost(postData)
      posts.value.unshift(response.data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updatePost = async (postId: number, postData: PostUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostOutSuccess = await blogService.updatePost(postId, postData)
      const index = posts.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        posts.value[index] = response.data
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour du post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deletePost = async (postId: number) => {
    try {
      isLoading.value = true
      error.value = null
      await blogService.deletePost(postId)
      posts.value = posts.value.filter(post => post.id !== postId)
      publishedPosts.value = publishedPosts.value.filter(post => post.id !== postId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression du post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const publishPost = async (postId: number) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostOutSuccess = await blogService.publishPost(postId)
      const index = posts.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        posts.value[index] = response.data
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la publication du post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getPostById = async (postId: number) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostOutSuccess = await blogService.getPostById(postId)
      currentPost.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getPostBySlug = async (slug: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostOutSuccess = await blogService.getPostBySlug(slug)
      currentPost.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du post'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === SECTIONS ===
  const fetchPostSections = async (postId: number) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostSectionListOutSuccess = await blogService.getPostSections(postId)
      postSections.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des sections'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPostSectionsBySlug = async (postSlug: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostSectionListOutSuccess = await blogService.getPostSectionsBySlug(postSlug)
      postSections.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des sections'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createSection = async (sectionData: PostSectionCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostSectionOutSuccess = await blogService.createSection(sectionData)
      postSections.value.push(response.data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de la section'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateSection = async (sectionId: number, sectionData: PostSectionUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PostSectionOutSuccess = await blogService.updateSection(sectionId, sectionData)
      const index = postSections.value.findIndex(section => section.id === sectionId)
      if (index !== -1) {
        postSections.value[index] = response.data
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la section'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteSection = async (sectionId: number) => {
    try {
      isLoading.value = true
      error.value = null
      await blogService.deleteSection(sectionId)
      postSections.value = postSections.value.filter(section => section.id !== sectionId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de la section'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearData = () => {
    categories.value = []
    posts.value = []
    publishedPosts.value = []
    currentPost.value = null
    postSections.value = []
  }

  return {
    // State
    categories,
    posts,
    publishedPosts,
    currentPost,
    postSections,
    isLoading,
    error,
    pagination,
    
    // Getters
    hasCategories,
    hasPosts,
    hasPublishedPosts,
    hasPostSections,
    
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchPosts,
    fetchPublishedPosts,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    getPostById,
    getPostBySlug,
    fetchPostSections,
    fetchPostSectionsBySlug,
    createSection,
    updateSection,
    deleteSection,
    clearError,
    clearData,
  }
})