import type { BaseModel, BaseOutPage, BaseOutSuccess } from './index'
// Types pour le module Blog
export interface PostCategoryOut extends BaseModel {
  id: number
  title: string
  slug: string
  description: string
}

export interface PostOut extends BaseModel {
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
}

export interface PostSectionOut extends BaseModel {
  id: number
  title: string
  cover_image?: string
  content: string
  position: number
  post_id: number
}

export interface PostCategoryCreateInput {
  title: string
  description: string
}

export interface PostCategoryUpdateInput {
  title?: string
  description?: string
}

export interface PostCreateInput {
  author_name: string
  title: string
  cover_image: File
  section_style?: string
  summary?: string
  tags?: string[]
  category_id: number
  backendErrors?: Record<string, string>
}

export interface PostUpdateInput {
  author_name?: string
  title?: string
  cover_image?: File
  summary?: string
  tags?: string[]
  category_id?: number
}

export interface PostFilter {
  page?: number
  page_size?: number
  search?: string
  category_id?: number
  tag?: string
  order_by?: 'created_at' | 'published_at' | 'title'
  asc?: 'asc' | 'desc'
}

export interface PostSectionCreateInput {
  title: string
  cover_image?: File
  content: string
  position: number
  post_id: number
}

export interface PostSectionUpdateInput {
  title?: string
  cover_image?: File
  content?: string
  position?: number
  post_id?: number
}

// Response types
export interface PostOutSuccess extends BaseOutSuccess<PostOut> {}
export interface PostsPageOutSuccess extends BaseOutPage<PostOut> {}
export interface PostCategoryOutSuccess extends BaseOutSuccess<PostCategoryOut> {}
export interface PostCategoryListOutSuccess extends BaseOutSuccess<PostCategoryOut[]> {}
export interface PostSectionOutSuccess extends BaseOutSuccess<PostSectionOut> {}
export interface PostSectionListOutSuccess extends BaseOutSuccess<PostSectionOut[]> {}

// Import BaseModel and BaseOutSuccess from index
