<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CategoryForm from '@/components/Blog/CategoryForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { blogService } from '@/services/api/blog'
import { usePermissions } from '@/composables/usePermissions'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'

const route = useRoute()
const router = useRouter()

// Permissions
const { canUpdateBlogs } = usePermissions()

const categoryId = Number(route.params.id)
const isLoading = ref(false)
const form = ref({
  title: '',
  description: '',
})

// Vérification des permissions d'accès
const hasAccess = computed(() => canUpdateBlogs.value)

const goBack = () => {
  router.push('/blog/categories')
}

const fetchCategory = async () => {
  isLoading.value = true
  try {
    const res = await blogService.getCategoryById(categoryId)
    console.log("nanyang brice : ", res.data)
    if (res && res.data) {
      form.value.title = res.data.title
      form.value.description = res.data.description
    }
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (data: any) => {
  // Vérifier les permissions
  if (!canUpdateBlogs.value) {
    showToast({
      message: 'Vous n\'avez pas les permissions nécessaires pour modifier une catégorie',
      type: 'error'
    })
    return
  }

  const confirmed = await confirmAction({
    title: 'Êtes vous sûres?',
    text: 'Voulez-vous vraiment enregistrer les modifications ?',
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
    const res = await blogService.updateCategory(categoryId, data)
    if (res && (res.success === true || res.message === 'Success')) {
      showToast({ message: 'Catégorie modifiée avec succès.', type: 'success' })
      router.push('/blog/categories')
    } else {
      showToast({ message: res?.message || 'Erreur lors de la modification.', type: 'error' })
      console.error('[DEBUG] Erreur API:', res)
    }
  } catch (err) {
    showToast({ message: 'Erreur serveur ou réseau.', type: 'error' })
    console.error('[DEBUG] Exception API:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Vérifier les permissions avant de charger les données
  if (!hasAccess.value) {
    showToast({
      message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page',
      type: 'error'
    })
    router.push('/blog/categories')
    return
  }
  
  await fetchCategory()
})
</script>

<template>
  <div class="category-edit-page">
    <!-- Vérification des permissions d'accès -->
    <div v-if="!hasAccess" class="text-center py-8">
      <VIcon icon="ri-shield-cross-line" size="64" color="error" />
      <h3 class="mt-4">Permission insuffisante</h3>
      <p class="text-medium-emphasis">
        Vous n'avez pas les permissions nécessaires pour modifier une catégorie.
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
          <h1 class="font-weight-bold mb-1">Modifier la catégorie</h1>
          <p class="text-body-2 text-secondary mb-0">Modifiez les informations de la catégorie puis enregistrez les
            changements.</p>
        </div>
      </div>
      <VCard elevation="2" class="pa-4">
        <VCardText>
          <CategoryForm v-model="form" :submit-label="'Modifier'" @submit="handleSubmit" @cancel="goBack" />
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style scoped>
.category-edit-page {
  padding: 2rem;
}
</style>
