import { apiService } from './base'

// ===== INTERFACES BLOG =====

export interface PostCategoryCreateInput {
  title: string
  description: string
}

export interface PostCategoryUpdateInput {
  title?: string
  description?: string
}

export interface PostCategoryOut {
  id: number
  title: string
  slug: string
  description: string
  created_at: string
  updated_at: string
}

export interface PostCategoryOutSuccess {
  success: boolean
  message: string
  data: PostCategoryOut
}

export interface PostCategoryListOutSuccess {
  success: boolean
  message: string
  data: PostCategoryOut[]
}

export interface PostCreateInput {
  author_name: string
  title: string
  cover_image: File
  section_style?: string
  summary?: string
  tags?: string[]
  category_id: number
}

export interface PostUpdateInput {
  author_name?: string
  title?: string
  cover_image?: File
  summary?: string
  tags?: string[]
  category_id?: number
}

export interface PostOut {
  id: number
  user_id: string
  author_name: string
  title: string
  slug: string
  cover_image: string
  summary?: string
  published_at?: string
  tags?: string[]
  category_id: number
  created_at: string
  updated_at: string
}

export interface PostOutSuccess {
  success: boolean
  message: string
  data: PostOut
}

export interface PostsPageOutSuccess {
  data: PostOut[]
  page: number
  number: number
  total_number: number
}

export interface PostSectionCreateInput {
  title: string
  cover_image?: File
  content: string
  position?: number
  post_id: number
}

export interface PostSectionUpdateInput {
  title?: string
  cover_image?: File
  content?: string
  position?: number
  post_id?: number
}

export interface PostSectionOut {
  id: number
  title: string
  cover_image?: string
  content: string
  position: number
  post_id: number
  created_at: string
  updated_at: string
}

export interface PostSectionOutSuccess {
  success: boolean
  message: string
  data: PostSectionOut
}

export interface PostSectionListOutSuccess {
  success: boolean
  message: string
  data: PostSectionOut[]
}

// ===== SERVICE BLOG =====

class BlogService {
  // === CATEGORIES ===

  /**
   * Récupérer la liste des catégories
   */
  async getCategories(): Promise<PostCategoryListOutSuccess> {
    const response = await apiService.get('/blog/categories')
    return response as PostCategoryListOutSuccess
  }

  /**
   * Créer une nouvelle catégorie
   */
  async createCategory(data: PostCategoryCreateInput): Promise<PostCategoryOutSuccess> {
    const response = await apiService.post('/blog/categories', data)
    return response as PostCategoryOutSuccess
  }

  /**
   * Récupérer une catégorie par ID
   */
  async getCategoryById(categoryId: number): Promise<PostCategoryOutSuccess> {
    const response = await apiService.get(`/blog/categories/${categoryId}`)
    return response as PostCategoryOutSuccess
  }

  /**
   * Mettre à jour une catégorie
   */
  async updateCategory(categoryId: number, data: PostCategoryUpdateInput): Promise<PostCategoryOutSuccess> {
    const response = await apiService.put(`/blog/categories/${categoryId}`, data)
    return response as PostCategoryOutSuccess
  }

  /**
   * Supprimer une catégorie
   */
  async deleteCategory(categoryId: number): Promise<PostCategoryOutSuccess> {
    const response = await apiService.delete(`/blog/categories/${categoryId}`)
    return response as PostCategoryOutSuccess
  }

  // === POSTS ===

  /**
   * Récupérer la liste des articles avec filtres
   */
  async getPosts(filters: {
    page?: number
    page_size?: number
    search?: string
    category_id?: number
    is_published?: boolean
    tag?: string
    order_by?: 'created_at' | 'published_at' | 'title'
    asc?: 'asc' | 'desc'
  } = {}): Promise<PostsPageOutSuccess> {
    const response = await apiService.get('/blog/posts', { params: filters })
    return response as PostsPageOutSuccess
  }

  /**
   * Récupérer les articles publiés
   */
  async getPublishedPosts(filters: {
    page?: number
    page_size?: number
    search?: string
    category_id?: number
    is_published?: boolean
    tag?: string
    order_by?: 'created_at' | 'published_at' | 'title'
    asc?: 'asc' | 'desc'
  } = {}): Promise<PostsPageOutSuccess> {
    const response = await apiService.get('/blog/get-published-posts', { params: filters })
    return response as PostsPageOutSuccess
  }

  /**
   * Créer un nouvel article
   */
  async createPost(data: PostCreateInput): Promise<PostOutSuccess> {
    const formData = new FormData()
    formData.append('author_name', data.author_name)
    formData.append('title', data.title)
    formData.append('cover_image', data.cover_image)
    if (data.section_style) formData.append('section_style', data.section_style)
    if (data.summary) formData.append('summary', data.summary)
    if (data.tags) formData.append('tags', JSON.stringify(data.tags))
    formData.append('category_id', data.category_id.toString())

    const response = await apiService.post('/blog/posts', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response as PostOutSuccess
  }

  /**
   * Récupérer un article par ID
   */
  async getPostById(postId: number): Promise<PostOutSuccess> {
    const response = await apiService.get(`/blog/posts/${postId}`)
    return response as PostOutSuccess
  }

  /**
   * Récupérer un article par slug
   */
  async getPostBySlug(postSlug: string): Promise<PostOutSuccess> {
    const response = await apiService.get(`/blog/posts-by-slug/${postSlug}`)
    return response as PostOutSuccess
  }

  /**
   * Mettre à jour un article
   */
  async updatePost(postId: number, data: PostUpdateInput): Promise<PostOutSuccess> {
    const formData = new FormData()
    if (data.author_name) formData.append('author_name', data.author_name)
    if (data.title) formData.append('title', data.title)
    if (data.cover_image) formData.append('cover_image', data.cover_image)
    if (data.summary) formData.append('summary', data.summary)
    if (data.tags) formData.append('tags', JSON.stringify(data.tags))
    if (data.category_id) formData.append('category_id', data.category_id.toString())

    const response = await apiService.put(`/blog/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response as PostOutSuccess
  }

  /**
   * Supprimer un article
   */
  async deletePost(postId: number): Promise<PostOutSuccess> {
    const response = await apiService.delete(`/blog/posts/${postId}`)
    return response as PostOutSuccess
  }

  /**
   * Publier un article
   */
  async publishPost(postId: number): Promise<PostOutSuccess> {
    const response = await apiService.post(`/blog/posts/${postId}/publish`)
    return response as PostOutSuccess
  }

  // === POST SECTIONS ===

  /**
   * Récupérer les sections d'un article par ID
   */
  async getPostSections(postId: number): Promise<PostSectionListOutSuccess> {
    const response = await apiService.get(`/blog/posts/${postId}/sections`)
    return response as PostSectionListOutSuccess
  }

  /**
   * Récupérer les sections d'un article par slug
   */
  async getPostSectionsBySlug(postSlug: string): Promise<PostSectionListOutSuccess> {
    const response = await apiService.get(`/blog/posts-by-slug/${postSlug}/sections`)
    return response as PostSectionListOutSuccess
  }

  /**
   * Créer une nouvelle section
   */
  async createSection(data: PostSectionCreateInput): Promise<PostSectionOutSuccess> {
    const formData = new FormData()
    formData.append('title', data.title)
    if (data.cover_image) formData.append('cover_image', data.cover_image)
    formData.append('content', data.content)
    formData.append('position', data.position?.toString() || '1')
    formData.append('post_id', data.post_id.toString())

    const response = await apiService.post('/blog/sections', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response as PostSectionOutSuccess
  }

  /**
   * Mettre à jour une section
   */
  async updateSection(sectionId: number, data: PostSectionUpdateInput): Promise<PostSectionOutSuccess> {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.cover_image) formData.append('cover_image', data.cover_image)
    if (data.content) formData.append('content', data.content)
    if (data.position) formData.append('position', data.position.toString())
    if (data.post_id) formData.append('post_id', data.post_id.toString())

    const response = await apiService.put(`/blog/sections/${sectionId}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response as PostSectionOutSuccess
  }

  /**
   * Supprimer une section
   */
  async deleteSection(sectionId: number): Promise<PostSectionOutSuccess> {
    const response = await apiService.delete(`/blog/sections/${sectionId}`)
    return response as PostSectionOutSuccess
  }
}

export const blogService = new BlogService()