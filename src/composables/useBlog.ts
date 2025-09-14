// Composable pour la gestion du blog
import { computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import type {
  PostCategoryCreateInput,
  PostCategoryUpdateInput,
  PostCreateInput,
  PostUpdateInput,
  PostFilter,
  PostSectionCreateInput,
  PostSectionUpdateInput,
} from '@/types/blog'

export function useBlog() {
  const blogStore = useBlogStore()

  // Getters réactifs
  const categories = computed(() => blogStore.categories)
  const posts = computed(() => blogStore.posts)
  const publishedPosts = computed(() => blogStore.publishedPosts)
  const currentPost = computed(() => blogStore.currentPost)
  const postSections = computed(() => blogStore.postSections)
  const isLoading = computed(() => blogStore.isLoading)
  const error = computed(() => blogStore.error)
  const pagination = computed(() => blogStore.pagination)
  const hasCategories = computed(() => blogStore.hasCategories)
  const hasPosts = computed(() => blogStore.hasPosts)
  const hasPublishedPosts = computed(() => blogStore.hasPublishedPosts)
  const hasPostSections = computed(() => blogStore.hasPostSections)

  // Actions pour les catégories
  const fetchCategories = async () => {
    return await blogStore.fetchCategories()
  }

  const createCategory = async (categoryData: PostCategoryCreateInput) => {
    return await blogStore.createCategory(categoryData)
  }

  const updateCategory = async (categoryId: number, categoryData: PostCategoryUpdateInput) => {
    return await blogStore.updateCategory(categoryId, categoryData)
  }

  const deleteCategory = async (categoryId: number) => {
    return await blogStore.deleteCategory(categoryId)
  }

  // Actions pour les posts
  const fetchPosts = async (filter?: PostFilter) => {
    return await blogStore.fetchPosts(filter)
  }

  const fetchPublishedPosts = async (filter?: PostFilter) => {
    return await blogStore.fetchPublishedPosts(filter)
  }

  const createPost = async (postData: PostCreateInput) => {
    return await blogStore.createPost(postData)
  }

  const updatePost = async (postId: number, postData: PostUpdateInput) => {
    return await blogStore.updatePost(postId, postData)
  }

  const deletePost = async (postId: number) => {
    return await blogStore.deletePost(postId)
  }

  const publishPost = async (postId: number) => {
    return await blogStore.publishPost(postId)
  }

  const getPostById = async (postId: number) => {
    return await blogStore.getPostById(postId)
  }

  const getPostBySlug = async (slug: string) => {
    return await blogStore.getPostBySlug(slug)
  }

  // Actions pour les sections
  const fetchPostSections = async (postId: number) => {
    return await blogStore.fetchPostSections(postId)
  }

  const fetchPostSectionsBySlug = async (postSlug: string) => {
    return await blogStore.fetchPostSectionsBySlug(postSlug)
  }

  const createSection = async (sectionData: PostSectionCreateInput) => {
    return await blogStore.createSection(sectionData)
  }

  const updateSection = async (sectionId: number, sectionData: PostSectionUpdateInput) => {
    return await blogStore.updateSection(sectionId, sectionData)
  }

  const deleteSection = async (sectionId: number) => {
    return await blogStore.deleteSection(sectionId)
  }

  // Utilitaires
  const clearError = () => {
    blogStore.clearError()
  }

  const clearData = () => {
    blogStore.clearData()
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
    hasCategories,
    hasPosts,
    hasPublishedPosts,
    hasPostSections,

    // Actions - Catégories
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,

    // Actions - Posts
    fetchPosts,
    fetchPublishedPosts,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    getPostById,
    getPostBySlug,

    // Actions - Sections
    fetchPostSections,
    fetchPostSectionsBySlug,
    createSection,
    updateSection,
    deleteSection,

    // Utilitaires
    clearError,
    clearData,
  }
}
