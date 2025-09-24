// Service API pour le blog
import { apiService } from './base'
import type {
  BaseOutSuccess,
  PostCategoryCreateInput,
  PostCategoryListOutSuccess,
  PostCategoryOutSuccess,
  PostCategoryUpdateInput,
  PostCreateInput,
  PostUpdateInput,
  PostFilter,
  PostOutSuccess,
  PostsPageOutSuccess,
  PostSectionCreateInput,
  PostSectionListOutSuccess,
  PostSectionOutSuccess,
  PostSectionUpdateInput,
} from '@/types/blog'

export class BlogService {
  // === CATEGORIES ===

  async getCategories(): Promise<PostCategoryListOutSuccess> {
    return apiService.get('/blog/categories')
  }

  async getCategoryById(id: number): Promise<PostCategoryOutSuccess> {
    return apiService.get(`/blog/categories/${id}`)
  }

  async createCategory(data: PostCategoryCreateInput): Promise<PostCategoryOutSuccess> {
    return apiService.postNoConfirm('/blog/categories', data)
  }

  async updateCategory(id: number, data: PostCategoryUpdateInput): Promise<PostCategoryOutSuccess> {
    return apiService.put(`/blog/categories/${id}`, data)
  }

  async deleteCategory(id: number): Promise<BaseOutSuccess> {
    return apiService.delete(`/blog/categories/${id}`)
  }

  // === POSTS ===

  async getPosts(filter?: PostFilter): Promise<PostsPageOutSuccess> {
    return apiService.get('/blog/posts', { params: filter })
  }

  async getPublishedPosts(filter?: PostFilter): Promise<PostsPageOutSuccess> {
    return apiService.get('/blog/get-published-posts', { params: filter })
  }

  async getPostById(id: number): Promise<PostOutSuccess> {
    return apiService.get(`/blog/posts/${id}`)
  }

  async getPostBySlug(slug: string): Promise<PostOutSuccess> {
    return apiService.get(`/blog/posts-by-slug/${slug}`)
  }

  // --- Création post avec FormData ---
  async createPostNoConfirm(data: PostCreateInput): Promise<PostOutSuccess> {
    const formData = new FormData()
    formData.append('author_name', data.author_name)
    formData.append('title', data.title)

    // ⚠️ Si cover_image est un tableau de fichiers (Vuetify VFileInput), on prend le premier
    if (Array.isArray(data.cover_image) && data.cover_image.length > 0) {
      formData.append('cover_image', data.cover_image[0])
    } else if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image)
    }

    formData.append('section_style', data.section_style || '')

    if (data.summary) formData.append('summary', data.summary)
    if (data.tags) formData.append('tags', JSON.stringify(data.tags))

    if (typeof data.category_id === 'number' && !Number.isNaN(data.category_id)) {
      formData.append('category_id', data.category_id.toString())
    }

    return apiService.upload('/blog/posts', formData) // ✅ upload = multipart
  }

  // blog.ts - Accepte directement un FormData depuis le composant
  async updatePostNoConfirm(id: number, formData: FormData): Promise<PostOutSuccess> {
    // Débogage : Afficher les entrées du FormData
    console.log('[DEBUG] FormData reçu dans updatePostNoConfirm:')
    for (const [key, value] of formData.entries()) {
      console.log(`[DEBUG] FormData entry: ${key}=${value}`)
    }

    return apiService.uploadPut(`/blog/posts/${id}`, formData)
  }

  async deletePostNoConfirm(id: number): Promise<BaseOutSuccess> {
    return apiService.delete(`/blog/posts/${id}`)
  }

  async publishPostNoConfirm(id: number): Promise<PostOutSuccess> {
    return apiService.postNoConfirm(`/blog/posts/${id}/publish`)
  }

  async publishPost(id: number): Promise<PostOutSuccess> {
    return apiService.postNoConfirm(`/blog/posts/${id}/publish`)
  }

  // === SECTIONS ===

  async getPostSections(postId: number): Promise<PostSectionListOutSuccess> {
    return apiService.get(`/blog/posts/${postId}/sections`)
  }

  async getPostSectionsBySlug(postSlug: string): Promise<PostSectionListOutSuccess> {
    return apiService.get(`/blog/posts-by-slug/${postSlug}/sections`)
  }

  async createSection(data: PostSectionCreateInput): Promise<PostSectionOutSuccess> {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('position', data.position.toString())
    formData.append('post_id', data.post_id.toString())

    if (Array.isArray(data.cover_image) && data.cover_image.length > 0) {
      formData.append('cover_image', data.cover_image[0])
    } else if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image)
    }

    return apiService.upload('/blog/sections', formData)
  }

  async updateSection(id: number, data: PostSectionUpdateInput): Promise<PostSectionOutSuccess> {
    const formData = new FormData()

    if (data.title) formData.append('title', data.title)
    if (data.content) formData.append('content', data.content)
    if (data.position !== undefined) formData.append('position', data.position.toString())
    if (data.post_id !== undefined) formData.append('post_id', data.post_id.toString())

    if (Array.isArray(data.cover_image) && data.cover_image.length > 0) {
      formData.append('cover_image', data.cover_image[0])
    } else if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image)
    }

    return apiService.uploadPut(`/blog/sections/${id}`, formData)
  }

  async deleteSection(id: number): Promise<BaseOutSuccess> {
    return apiService.delete(`/blog/sections/${id}`)
  }

  // === TAGS ===
  async getAllTags(): Promise<string[]> {
    try {
      const res = await apiService.get('/blog/posts')
      const posts = res.data || []
      
      // Extraire tous les tags de tous les posts
      const allTags = new Set<string>()
      
      posts.forEach((post: any) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tagItem: any) => {
            if (typeof tagItem === 'string') {
              // Essayer de parser si c'est du JSON
              try {
                if (tagItem.trim().startsWith('[')) {
                  const parsed = JSON.parse(tagItem.replace(/'/g, '"'))
                  if (Array.isArray(parsed)) {
                    parsed.forEach(tag => {
                      if (tag && tag.trim()) {
                        allTags.add(tag.trim())
                      }
                    })
                  }
                } else {
                  // Tag simple
                  if (tagItem.trim()) {
                    allTags.add(tagItem.trim())
                  }
                }
              } catch {
                // Si parsing échoue, ajouter comme tag simple
                const cleanTag = tagItem.replace(/[\[\]"']/g, '').trim()
                if (cleanTag) {
                  allTags.add(cleanTag)
                }
              }
            }
          })
        }
      })
      
      return Array.from(allTags).sort()
    } catch (error) {
      console.error('Erreur lors de la récupération des tags:', error)
      return []
    }
  }
}

export const blogService = new BlogService()
