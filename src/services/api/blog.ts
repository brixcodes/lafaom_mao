import { apiService } from './base'

// Types pour le blog
export interface PostCategory {
  id: number
  name: string
  description?: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  status: string
  published_at?: string
  category_id: number
  author_id: number
  views: number
  created_at: string
  updated_at: string
  category?: PostCategory
  sections?: PostSection[]
}

export interface PostSection {
  id: number
  post_id: number
  title: string
  content: string
  order: number
  created_at: string
}

export interface BlogFilter {
  page?: number
  limit?: number
  search?: string
  category_id?: number
  status?: string
  author_id?: number
}

export interface CreatePostRequest {
  title: string
  content: string
  excerpt?: string
  featured_image?: string
  category_id: number
  status: string
  sections?: PostSectionInput[]
}

export interface PostSectionInput {
  title: string
  content: string
  order: number
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  slug: string
}

class BlogService {
  // === ARTICLES ===
  // Récupérer la liste des articles
  async getPosts(filters: BlogFilter = {}): Promise<any> {
    return await apiService.get('/blog/posts', { params: filters })
  }

  // Récupérer un article par ID
  async getPostById(postId: number): Promise<Post> {
    return await apiService.get(`/blog/posts/${postId}`)
  }

  // Récupérer un article par slug
  async getPostBySlug(slug: string): Promise<Post> {
    return await apiService.get(`/blog/posts-by-slug/${slug}`)
  }

  // Créer un article
  async createPost(postData: CreatePostRequest): Promise<Post> {
    return await apiService.post('/blog/posts', postData)
  }

  // Mettre à jour un article
  async updatePost(postId: number, postData: Partial<CreatePostRequest>): Promise<Post> {
    return await apiService.put(`/blog/posts/${postId}`, postData) as Post
  }

  // Supprimer un article
  async deletePost(postId: number): Promise<void> {
    return await apiService.delete(`/blog/posts/${postId}`)
  }

  // Publier un article
  async publishPost(postId: number): Promise<Post> {
    return await apiService.post(`/blog/posts/${postId}/publish`)
  }

  // Dépublier un article
  async unpublishPost(postId: number): Promise<Post> {
    return await apiService.post(`/blog/posts/${postId}/unpublish`)
  }

  // Incrémenter les vues d'un article
  async incrementPostViews(postId: number): Promise<void> {
    return await apiService.post(`/blog/posts/${postId}/views`)
  }

  // === SECTIONS D'ARTICLES ===
  // Récupérer les sections d'un article
  async getPostSections(postId: number): Promise<PostSection[]> {
    return await apiService.get(`/blog/posts/${postId}/sections`)
  }

  // Créer une section d'article
  async createPostSection(postId: number, sectionData: PostSectionInput): Promise<PostSection> {
    return await apiService.post(`/blog/sections`, { ...sectionData, post_id: postId })
  }

  // Mettre à jour une section d'article
  async updatePostSection(sectionId: number, sectionData: Partial<PostSectionInput>): Promise<PostSection> {
    return await apiService.put(`/blog/sections/${sectionId}`, sectionData) as PostSection
  }

  // Supprimer une section d'article
  async deletePostSection(sectionId: number): Promise<void> {
    return await apiService.delete(`/blog/sections/${sectionId}`)
  }

  // === CATÉGORIES ===
  // Récupérer la liste des catégories
  async getCategories(filters: any = {}): Promise<any> {
    return await apiService.get('/blog/categories', { params: filters })
  }

  // Récupérer une catégorie par ID
  async getCategoryById(categoryId: number): Promise<PostCategory> {
    return await apiService.get(`/blog/categories/${categoryId}`)
  }

  // Récupérer une catégorie par slug
  async getCategoryBySlug(slug: string): Promise<PostCategory> {
    return await apiService.get(`/blog/categories/slug/${slug}`)
  }

  // Créer une catégorie
  async createCategory(categoryData: CreateCategoryRequest): Promise<PostCategory> {
    return await apiService.post('/blog/categories', categoryData)
  }

  // Mettre à jour une catégorie
  async updateCategory(categoryId: number, categoryData: Partial<CreateCategoryRequest>): Promise<PostCategory> {
    return await apiService.put(`/blog/categories/${categoryId}`, categoryData) as PostCategory
  }

  // Supprimer une catégorie
  async deleteCategory(categoryId: number): Promise<void> {
    return await apiService.delete(`/blog/categories/${categoryId}`)
  }

  // Récupérer toutes les catégories actives
  async getActiveCategories(): Promise<PostCategory[]> {
    return await apiService.get('/blog/categories/active/all')
  }

  // === STATISTIQUES BLOG ===
  // Récupérer les statistiques du blog
  async getBlogStats(): Promise<any> {
    return await apiService.get('/blog/stats')
  }

  // Récupérer les articles populaires
  async getPopularPosts(limit: number = 5): Promise<Post[]> {
    return await apiService.get('/blog/popular', { params: { limit } })
  }

  // Récupérer les articles récents
  async getRecentPosts(limit: number = 5): Promise<Post[]> {
    return await apiService.get('/blog/recent', { params: { limit } })
  }

  // Récupérer tous les tags (méthode manquante)
  async getAllTags(): Promise<string[]> {
    // Pour l'instant, retourner des tags de démonstration
    // Cette méthode devrait être implémentée côté backend
    return [
      'Formation',
      'Emploi',
      'Développement',
      'Technologie',
      'Carrière',
      'Compétences',
      'Recrutement',
      'Innovation'
    ]
  }
}

export const blogService = new BlogService()