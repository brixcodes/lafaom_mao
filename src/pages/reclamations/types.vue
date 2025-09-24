<template>
  <div class="types-list-page">
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">Types de réclamations</h1>
        <p class="text-body-1 text-medium-emphasis">Gérez tous les types de réclamations disponibles</p>
      </div>
      <VBtn color="primary" prepend-icon="ri-add-line" @click="goToCreate">Nouveau type</VBtn>
    </div>
    
    <VCard class="mb-5">
      <VCardText>
        <VTextField
          v-model="filter"
          label="Filtrer les types de réclamations"
          clearable
          prepend-inner-icon="ri-filter-line"
        />
      </VCardText>
    </VCard>

    <ReclamationTypeTable
      :types="filteredTypes"
      :headers="headers"
      :isLoading="isLoading"
      @edit="goToEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import ReclamationTypeTable from '@/components/reclamation/ReclamationTypeTable.vue'
import type { ReclamationType } from '@/types/reclamation'

// Router
const router = useRouter()

// Composable
const {
  reclamationTypes,
  isLoading,
  error,
  loadReclamationTypes,
  deleteReclamationType
} = useReclamation()

// State
const filter = ref('')

// Headers for the data table
const headers = [
  { title: 'Nom', key: 'name', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Computed
const filteredTypes = computed(() => {
  if (!filter.value) return reclamationTypes.value
  const f = filter.value.toLowerCase()
  return reclamationTypes.value.filter(type =>
    (type.name && type.name.toLowerCase().includes(f)) ||
    (type.description && type.description.toLowerCase().includes(f))
  )
})

// Methods
const goToCreate = () => {
  router.push({ name: 'reclamations-types-create' })
}

const goToEdit = (idOrRow: any) => {
  // Si l'argument est un objet avec un id, utilise id, sinon utilise directement l'argument
  const id = typeof idOrRow === 'object' && idOrRow !== null ? idOrRow.id : idOrRow
  if (id) {
    router.push({ name: 'reclamations-types-edit', params: { id } })
  } else {
    console.error('ID de type de réclamation non défini pour l\'édition', idOrRow)
  }
}

const handleDelete = async (type: ReclamationType) => {
  const confirmed = await confirmAction({
    title: 'Supprimer le type',
    text: `Êtes-vous sûr de vouloir supprimer définitivement le type "${type.name}" ?\n\nCette action est irréversible et le type ne sera plus disponible.`,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler'
  })

  if (!confirmed) return

  try {
    await deleteReclamationType(type.id)
    showToast({
      message: 'Type de réclamation supprimé avec succès',
      type: 'success'
    })
    loadReclamationTypes()
  } catch (error: any) {
    console.error('Erreur lors de la suppression du type:', error)
    showToast({
      message: 'Erreur lors de la suppression du type de réclamation',
      type: 'error'
    })
  }
}

// Lifecycle
onMounted(() => {
  loadReclamationTypes()
})
</script>

<style scoped>
.types-list-page {
  padding: 2rem;
}
</style>