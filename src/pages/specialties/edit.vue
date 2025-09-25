<template>
  <div class="specialty-edit-page">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" :to="{ name: 'specialties-index' }" class="me-3" />
      <div>
        <h1 class="text-h4 mb-1">
          Modifier une spécialité
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Remplissez les informations pour modifier la spécialité
        </p>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement de la spécialité...</p>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mb-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <!-- Formulaire -->
    <VCard v-else-if="currentSpecialty">
      <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <VCardText>
          <VRow>
            <!-- Nom de la spécialité -->
            <VCol cols="12" md="12">
              <VTextField v-model="specialty.name" label="Nom de la spécialité *"
                placeholder="Ex: Développement Web, Marketing Digital, Gestion de Projet..." variant="outlined"
                density="comfortable" prepend-inner-icon="ri-award-line"
                :rules="[(v: string) => !!v || 'Le nom est obligatoire']" required />
            </VCol>

            <!-- Description -->
            <VCol cols="12">
              <VTextarea v-model="specialty.description" label="Description"
                placeholder="Décrivez la spécialité, ses objectifs et son contenu..." variant="outlined"
                density="comfortable" rows="4" prepend-inner-icon="ri-file-text-line" />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider class="my-4" />
        <VCardActions class="justify-end">
          <VBtn color="error" variant="flat" size="large" :to="{ name: 'specialties-index' }" :disabled="isSaving">
            Annuler
          </VBtn>
          <VBtn color="primary" variant="flat" size="large" type="submit" :loading="isSaving" :disabled="!isFormValid">
            Modifier
          </VBtn>
        </VCardActions>

      </VForm>
    </VCard>

    <!-- Spécialité non trouvée -->
    <VCard v-else>
      <VCardText class="text-center py-12">
        <VIcon icon="ri-error-warning-line" size="60" class="text-error mb-4" />
        <h3 class="text-h5 mb-2">Spécialité non trouvée</h3>
        <p class="text-body-1 text-medium-emphasis mb-4">
          La spécialité que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <VBtn color="primary" :to="{ name: 'specialties-index' }">
          Retour à la liste
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSpecialtyStore } from '@/stores/specialties'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { Specialty, SpecialtyUpdateInput } from '@/types/specialties'

const router = useRouter()
const route = useRoute()
const specialtyStore = useSpecialtyStore()

// Form ref
const formRef = ref()

// State
const isFormValid = ref(false)
const isSaving = ref(false)
const error = ref('')
const currentSpecialty = ref<Specialty | null>(null)

// Specialty form
const specialty = ref<SpecialtyUpdateInput>({
  name: '',
  description: ''
})

// Computed
const isLoading = computed(() => specialtyStore.isLoading)

// Methods
const loadSpecialty = async () => {
  try {
    const specialtyId = parseInt(route.params.id as string)
    currentSpecialty.value = await specialtyStore.fetchSpecialty(specialtyId)

    // Populate form with current specialty data
    specialty.value = {
      name: currentSpecialty.value.name,
      description: currentSpecialty.value.description || ''
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement de la spécialité:', err)
    error.value = 'Erreur lors du chargement de la spécialité'
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const confirmed = await confirmAction({
    title: 'Sauvegarder les modifications',
    text: `Êtes-vous sûr de vouloir modifier la spécialité "${specialty.value.name}" ?`,
    confirmButtonText: '<span style="color:white">Sauvegarder</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  isSaving.value = true
  try {
    const specialtyId = parseInt(route.params.id as string)
    await specialtyStore.updateSpecialty(specialtyId, specialty.value)
    showToast({ message: 'Spécialité modifiée avec succès', type: 'success' })
    router.push({ name: 'specialties-index' })
  } catch (err: any) {
    console.error('Erreur lors de la modification:', err)
    error.value = err.message || 'Erreur lors de la modification de la spécialité'
    showToast({ message: 'Erreur lors de la modification', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const clearError = () => {
  error.value = ''
}

// Lifecycle
onMounted(() => {
  loadSpecialty()
})
</script>

<style scoped>
.specialty-edit-page {
  padding: 24px;
}
</style>
