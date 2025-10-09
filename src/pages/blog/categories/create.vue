<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogCategories } from '@/composables/useBlogCategories'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'
import CategoryForm from '@/components/Blog/CategoryForm.vue'

import { validateRequired, validateMinLength } from '@/utils/validation'

const router = useRouter()

// Utiliser le composable pour les catégories
const { createCategory, generateSlug } = useBlogCategories()

const isLoading = ref(false)
const form = ref({
  title: '',
  description: '',
  slug: '',
})

// S'assurer que le form est toujours initialisé
onMounted(() => {
  if (!form.value) {
    form.value = {
      title: '',
      description: '',
      slug: '',
    }
  }
})

const titleRules = [
  (v: string) => {
    const res = validateRequired(v, 'Titre de la catégorie')
    return res.valid ? true : res.error
  },
  (v: string) => {
    const res = validateMinLength(v, 2, 'Titre de la catégorie')
    return res.valid ? true : res.error
  },
]

const descriptionRules = [
  (v: string) => {
    if (!v) return true
    const res = validateMinLength(v, 3, 'Description')
    return res.valid ? true : res.error
  },
]

const goBack = () => {
  router.push('/blog/categories')
}


const validate = () => {
  const titleCheck = validateRequired(form.value.title, 'Titre de la catégorie')
  if (!titleCheck.valid) return titleCheck.error
  const titleMin = validateMinLength(form.value.title, 2, 'Titre de la catégorie')
  if (!titleMin.valid) return titleMin.error

  if (form.value.description) {
    const descMin = validateMinLength(form.value.description, 3, 'Description')
    if (!descMin.valid) return descMin.error
  }
  return null
}

const handleSubmit = async (data: any) => {
  const confirmed = await confirmAction({
    title: 'Êtes vous sûres?',
    text: 'Souhaitez-vous réellement enregistrer cette catégorie ?',
    confirmButtonText: '<span style="color:white">Enregistrer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  if (!confirmed) return

  isLoading.value = true
  try {
    // Générer le slug automatiquement
    const formData = {
      ...data,
      slug: generateSlug(data.title)
    }

    await createCategory(formData)
    router.push('/blog/categories')
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  } finally {
    isLoading.value = false
  }
}

const clearForm = () => {
  form.value = { title: '', description: '', slug: '' }
}

</script>

<template>
  <div class="category-create-page">
    <!-- Contenu principal -->
    <div>
      <div class="d-flex align-center mb-4">
        <VBtn icon variant="text" class="mr-3" aria-label="Retour" title="Retour" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Créer une catégorie</h1>
          <p class="text-body-2 text-secondary mb-0">Remplissez le formulaire pour ajouter une nouvelle catégorie au
            blog.
          </p>
        </div>
      </div>
      <VContainer>
        <CategoryForm v-model="form" :submit-label="'Enregistrer'" @submit="handleSubmit" @cancel="clearForm" />
      </VContainer>
    </div>
  </div>
</template>

<style scoped>
.category-create-page {
  padding: 2rem;
}
</style>
