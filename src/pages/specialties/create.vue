<template>
  <div class="specialty-create-page">
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" :to="{ name: 'specialties-index' }" class="me-3" />
      <div>
        <h1 class="text-h4 mb-1">
          Créer une spécialité
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Remplissez les informations pour créer une nouvelle spécialité
        </p>
      </div>
    </div>

    <!-- Formulaire -->
    <VCard>
      <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <VCardText>
          <VRow>
            <!-- Nom de la spécialité -->
            <VCol cols="12" md="12">
              <VTextField v-model="specialty.name" label="Spécialité *"
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
            Enregistrer
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTrainingStore } from '@/stores/training'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { SpecialtyCreateInput } from '@/types/specialties'

const router = useRouter()
const trainingStore = useSpecialtyStore()

// Form ref
const formRef = ref()

// State
const isFormValid = ref(false)
const isSaving = ref(false)
const error = ref('')

// Specialty form
const specialty = ref<SpecialtyCreateInput>({
  name: '',
  description: ''
})

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return

  const confirmed = await confirmAction({
    title: 'Créer la spécialité',
    text: `Êtes-vous sûr de vouloir créer la spécialité "${specialty.value.name}" ?`,
    confirmButtonText: '<span style="color:white">Créer</span>',
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
    await trainingStore.createSpecialty(specialty.value)
    showToast({ message: 'Spécialité créée avec succès', type: 'success' })
    router.push({ name: 'specialties-index' })
  } catch (err: any) {
    console.error('Erreur lors de la création:', err)
    error.value = err.message || 'Erreur lors de la création de la spécialité'
    showToast({ message: 'Erreur lors de la création', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const clearError = () => {
  error.value = ''
}
</script>

<style scoped>
.specialty-create-page {
  padding: 24px;
}
</style>
