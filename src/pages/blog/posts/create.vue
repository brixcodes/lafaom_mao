<template>
  <div class="blog-create-page">
    <div class="d-flex align-center mb-4">
      <VBtn icon variant="text" class="mr-3" aria-label="Retour" title="Retour" @click="goBack">
        <VIcon icon="ri-arrow-left-line" color="primary" />
      </VBtn>
      <div>
        <h1 class="font-weight-bold mb-1">Créer une actualité</h1>
        <p class="text-body-2 text-secondary mb-0">
          Remplissez le formulaire pour ajouter une nouvelle actualitée à votre blog.
        </p>
      </div>
    </div>

    <VAlert v-if="categoriesError" type="warning" closable class="mb-4">
      <div class="d-flex align-center">
        <VIcon icon="ri-error-warning-line" class="mr-2" />
        <div>
          <strong>Impossible de charger les catégories</strong>
          <p class="mb-0">{{ categoriesError }}</p>
        </div>
        <VSpacer />
        <VBtn color="warning" variant="tonal" @click="fetchCategories" :loading="isCategoriesLoading">
          Réessayer
        </VBtn>
      </div>
    </VAlert>

    <PostForm v-model="form" :categories="categories" @submit="handleCreate">
      <template #actions>
        <VCardActions class="justify-end">
          <VBtn color="error" variant="flat" size="large" @click="goBack">
            Annuler
          </VBtn>
          <VBtn color="primary" variant="flat" size="large" type="submit" :loading="isLoading">
            Enregistrer
          </VBtn>
        </VCardActions>
      </template>
    </PostForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api/base'
import { blogService } from '@/services/api/blog'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()
const isLoading = ref(false)
const categories = ref<any[]>([])
const isCategoriesLoading = ref(false)
const categoriesError = ref('')

const form = ref({
  author_name: '',
  title: '',
  cover_image: null,
  section_style: 'Normal',
  summary: '',
  tags: [],
  category_id: null as number | null,
  backendErrors: {} as Record<string, string>,
})

const goBack = () => router.back()

const fetchCategories = async () => {
  isCategoriesLoading.value = true
  categoriesError.value = ''
  
  try {
    // Ajout d'un timeout plus court pour éviter de bloquer trop longtemps
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Délai d\'attente dépassé')), 10000)
    })
    
    const fetchPromise = blogService.getCategories()
    
    // Race entre la requête et le timeout
    const res = await Promise.race([fetchPromise, timeoutPromise])
    categories.value = res.data
  } catch (error: any) {
    console.error('Erreur lors du chargement des catégories:', error)
    categoriesError.value = error.message || 'Impossible de charger les catégories. Veuillez réessayer.'
    
    // Catégories par défaut en cas d'erreur
    categories.value = [
      { id: 1, title: 'Technologie' },
      { id: 2, title: 'Design' },
      { id: 3, title: 'Marketing' },
    ]
  } finally {
    isCategoriesLoading.value = false
  }
}

const handleCreate = async (formData: FormData) => {
  isLoading.value = true
  try {
    const res = await apiService.upload('/blog/posts', formData) as any
    showToast({ message: "✅ L'actualitée a été créé avec succès.", type: 'success' })
    router.push('/blog/posts')
  } catch (err: any) {
    if (err?.response?.status === 422 && err?.response?.data?.error) {
      const backendErrors: Record<string, string> = {}
      err.response.data.error.forEach((e: any) => {
        if (e.loc && e.loc.length > 0 && e.msg) {
          const field = e.loc[e.loc.length - 1]
          backendErrors[field] = e.msg
        }
      })
      form.value.backendErrors = backendErrors
    }
    showToast({ message: 'Erreur lors de la création de l\'article.', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.blog-create-page {
  padding: 2rem;
}
</style>
