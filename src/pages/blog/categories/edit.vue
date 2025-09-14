<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CategoryForm from '@/components/Blog/CategoryForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { blogService } from '@/services/api/blog'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'

const route = useRoute()
const router = useRouter()
const categoryId = Number(route.params.id)
const isLoading = ref(false)
const form = ref({
  title: '',
  description: '',
})

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

onMounted(fetchCategory)
</script>

<template>
  <div class="category-edit-page">
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
</template>

<style scoped>
.category-edit-page {
  padding: 2rem;
}
</style>
