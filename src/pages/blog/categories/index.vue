


<template>
  <div class="category-list-page">
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 mb-2">Catégories du blog</h1>
          <p class="text-body-1 text-medium-emphasis">Gérez toutes les catégories du blog</p>
        </div>
        <VBtn 
          color="primary" 
          prepend-icon="ri-add-line" 
          @click="goToCreate"
        >
          Nouvelle catégorie
        </VBtn>
      </div>
      
      <!-- Filtres -->
      <VCard class="mb-5">
        <VCardText>
          <VTextField
            v-model="filter"
            label="Filtrer les catégories"
            clearable
            prepend-inner-icon="ri-filter-line"
          />
        </VCardText>
      </VCard>
      
      <!-- Tableau des catégories -->
      <CategoryTable
        :categories="filteredCategories"
        :headers="headers"
        :isLoading="isLoading"
        @edit="goToEdit"
        @delete="handleDelete"
      />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { blogService } from '@/services/api/blog'
import CategoryTable from '@/components/Blog/CategoryTable.vue'
import Swal from 'sweetalert2'
import { showToast } from '@/components/toast/toastManager'


const router = useRouter()


const categories = ref<any[]>([])
const filter = ref('')
const filteredCategories = computed(() => {
  if (!filter.value) return categories.value
  const f = filter.value.toLowerCase()
  return categories.value.filter(cat =>
    (cat.title && cat.title.toLowerCase().includes(f)) ||
    (cat.slug && cat.slug.toLowerCase().includes(f)) ||
    (cat.description && cat.description.toLowerCase().includes(f))
  )
})
const isLoading = ref(false)

const headers = [
  { title: 'Titre', key: 'title' },
  { title: 'Slug', key: 'slug' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const fetchCategories = async () => {
  isLoading.value = true
  try {
      const res = await blogService.getCategories()
      // res.data.data est le tableau réel
      if (Array.isArray(res.data)) {
        categories.value = res.data
      } else if (Array.isArray(res.data?.data)) {
        categories.value = res.data.data
      } else {
        categories.value = []
      }
  } finally {
    isLoading.value = false
  }
}

const goToCreate = () => {
  router.push('/blog/categories/create')
}
const goToEdit = (idOrRow: any) => {
  // Si l'argument est un objet avec un id, utilise id, sinon utilise directement l'argument
  const id = typeof idOrRow === 'object' && idOrRow !== null ? idOrRow.id : idOrRow
  if (id) {
    router.push(`/blog/categories/${id}/edit`)
  } else {
    console.error('ID de catégorie non défini pour l’édition', idOrRow)
  }
}



const handleDelete = async (category: any) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûrs ?',
    html: 'Souhaitez-vous supprimer cette catégorie ?Sachez que cette action est irréversible.',
    showCancelButton: true, // 👉 Ajouté pour afficher le bouton Annuler
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (result.isConfirmed) {
    await blogService.deleteCategory(category.id)
    showToast({ message: 'Catégorie supprimée avec succès.', type: 'success' }) // Corrigé aussi le texte
    fetchCategories()
  }
}


onMounted(async () => {
  await fetchCategories()
})
</script>

<style scoped>
.category-list-page {
  padding: 2rem;
}
</style>
