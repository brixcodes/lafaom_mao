<template>
  <div class="training-specialties-index-page">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          Spécialités de formations
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez les spécialités de formation disponibles dans le système
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn
          prepend-icon="ri-add-line"
          color="primary"
          :to="{ name: 'training-specialties-create' }"
        >
          Nouvelle spécialité
        </VBtn>
      </div>
    </div>

    <!-- Card -->
    <VCard class="mb-5">
      <VCardText>
        <VTextField
          v-model="filter"
          label="Filtrer les spécialités"
          clearable
          prepend-inner-icon="ri-filter-line"
          class="mb-2"
        />
      </VCardText>
    </VCard>

    <!-- Table -->
    <SpecialtyTable
      :specialties="filteredSpecialties"
      :headers="headers"
      :isLoading="isDeleting"
      :canEdit="hasUpdatePermission"
      :canDelete="hasDeletePermission"
      @edit="id => $router.push({ name: 'training-specialties-edit', params: { id } })"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePermissionStore } from '@/stores/permission'
import { trainingService } from '@/services/api/training'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'
import SpecialtyTable from '@/components/Training/Specialty/SpecialtyTable.vue'

const permissionStore = usePermissionStore()
const { hasPermission } = storeToRefs(permissionStore)

const hasCreatePermission = computed(() => hasPermission.value('CAN_CREATE_SPECIALTY'))
const hasUpdatePermission = computed(() => hasPermission.value('CAN_UPDATE_SPECIALTY'))
const hasDeletePermission = computed(() => hasPermission.value('CAN_DELETE_SPECIALTY'))

const specialties = ref<any[]>([])
const filter = ref('')
const isDeleting = ref(false)

const headers = [
  { title: 'Nom', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]

const fetchSpecialties = async () => {
  try {
    const response = await trainingService.listSpecialties({})
    specialties.value = response.data
  } catch (error) {
    showToast({ message: 'Erreur lors du chargement des spécialités', type: 'error' })
  }
}

const filteredSpecialties = computed(() => {
  if (!filter.value) return specialties.value
  const f = filter.value.toLowerCase()
  return specialties.value.filter(specialty =>
    (specialty.name && specialty.name.toLowerCase().includes(f)) ||
    (specialty.description && specialty.description.toLowerCase().includes(f))
  )
})

const handleDelete = async (specialty: any) => {
  const confirmed = await confirmAction({
    title: 'Êtes vous sûres?',
    html: `Souhaitez vous supprimer <strong>${specialty.name}</strong> ?<br><span>Cette action est irréversible et n'engage que vous.</span>`,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  if (!confirmed) return

  isDeleting.value = true
  try {
    await trainingService.deleteSpecialty(specialty.id)
    showToast({ message: 'Spécialité supprimée avec succès', type: 'success' })
    fetchSpecialties()
  } catch (error) {
    showToast({ message: 'Erreur lors de la suppression de la spécialité', type: 'error' })
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchSpecialties)
</script>

<style scoped>
.training-specialties-index-page {
  padding: 2rem;
}

.border-b {
  border-bottom: 1px solid #eee;
}

.custom-table thead {
  background-color: #f9fafb;
}

.custom-table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #6b7280;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.hover-row:hover {
  background-color: #f3f4f6;
}
</style>
