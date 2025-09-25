<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api/base'
import { usePermissions } from '@/composables/usePermissions'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'
import CategoryForm from '@/components/Blog/CategoryForm.vue'

import { validateRequired, validateMinLength } from '@/utils/validation'

const router = useRouter()

// Permissions
const { canCreateBlogs } = usePermissions()

const isLoading = ref(false)
const form = ref({
  title: '',
  description: '',
  slug: '',
})

// Vérification des permissions d'accès
const hasAccess = computed(() => canCreateBlogs.value)

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
  // Vérifier les permissions
  if (!canCreateBlogs.value) {
    showToast({
      message: 'Vous n\'avez pas les permissions nécessaires pour créer une catégorie',
      type: 'error'
    })
    return
  }

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
    const res = await apiService.postNoConfirm<{ success?: boolean; message?: string }>('/blog/categories', { ...data, slug: form.value.slug })
    console.log('[DEBUG] Réponse API:', res)
    if (res && (res.success === true || res.message === 'Success')) {
      showToast({ message: 'Catégorie créée avec succès.', type: 'success' })
      router.push('/blog/categories')
    } else {
      showToast({ message: res?.message || 'Erreur lors de la création.', type: 'error' })
      console.error('[DEBUG] Erreur API:', res)
    }
  } catch (err) {
    showToast({ message: 'Erreur serveur ou réseau.', type: 'error' })
    console.error('[DEBUG] Exception API:', err)
  } finally {
    isLoading.value = false
  }
}

const clearForm = () => {
  form.value = { title: '', description: '', slug: '' }
}

// Lifecycle
onMounted(async () => {
  // Vérifier les permissions avant de charger la page
  if (!hasAccess.value) {
    showToast({
      message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page',
      type: 'error'
    })
    router.push('/blog/categories')
    return
  }
})
</script>

<template>
  <div class="category-create-page">
    <!-- Vérification des permissions d'accès -->
    <div v-if="!hasAccess" class="text-center py-8">
      <VIcon icon="ri-shield-cross-line" size="64" color="error" />
      <h3 class="mt-4">Permission insuffisante</h3>
      <p class="text-medium-emphasis">
        Vous n'avez pas les permissions nécessaires pour créer une catégorie.
      </p>
      <VBtn color="primary" to="/blog/categories" class="mt-4">
        <VIcon icon="ri-arrow-left-line" class="me-2" />
        Retour aux catégories
      </VBtn>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <div class="d-flex align-center mb-4">
        <VBtn icon variant="text" class="mr-3" aria-label="Retour" title="Retour" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Créer une catégorie</h1>
          <p class="text-body-2 text-secondary mb-0">Remplissez le formulaire pour ajouter une nouvelle catégorie au blog.
          </p>
        </div>
      </div>
      <VContainer>
        <VCard elevation="2" class="pa-4">
          <VCardText>
            <CategoryForm v-model="form" :submit-label="'Enregistrer'" @submit="handleSubmit" @cancel="clearForm" />
          </VCardText>
        </VCard>
      </VContainer>
    </div>
  </div>
</template>

<style scoped>
.category-create-page {
  padding: 2rem;
}
</style>
