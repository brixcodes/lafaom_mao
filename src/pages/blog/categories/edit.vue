<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CategoryForm from '@/components/Blog/CategoryForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogCategories } from '@/composables/useBlogCategories'
import { usePermissions } from '@/composables/usePermissions'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'

const route = useRoute()
const router = useRouter()

// Utiliser le composable pour les catégories
const { updateCategory, getCategoryById, generateSlug } = useBlogCategories()

const { canUpdateBlogs } = usePermissions()

const categoryId = Number(route.params.id)
const isLoading = ref(false)
const form = ref({
  title: '',
  description: '',
})

const hasAccess = computed(() => canUpdateBlogs.value)

const goBack = () => {
  router.push('/blog/categories')
}

const fetchCategory = async () => {
  isLoading.value = true
  try {
    const res = await getCategoryById(categoryId)
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
      message: "Vous n'avez pas les permissions nécessaires pour modifier une catégorie",
      type: 'error'
    })
    return
  }

  const confirmed = await confirmAction({
    title: 'Êtes vous sûres?',
    text: 'Voulez-vous vraiment modifier les informations de cette catégorie ?',
    confirmButtonText: '<span style="color:white">Modifier</span>',
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
    const formData = {
      ...data,
      slug: generateSlug(data.title)
    }

    await updateCategory(categoryId, formData)
    router.push('/blog/categories')
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchCategory()
})
</script>

<template>
  <div class="category-edit-page">
    <div>
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
      <VContainer>
        <CategoryForm v-model="form" :submit-label="'Modifier'" @submit="handleSubmit" @cancel="goBack" />
      </VContainer>
    </div>
  </div>
</template>
