<template>
  <VContainer fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        
        <h1 class="text-h4 font-weight-bold mb-2">
          
      <VIcon icon="ri-arrow-left-line" variant="outlined" color="primary" class="mr-3" @click="goBack" />
       Créer un type de réclamation</h1>
        <p class="text-body-1 text-medium-emphasis">
          Créez un nouveau type de réclamation pour catégoriser les problèmes
        </p>
      </div>
    </div>

    <!-- Formulaire de création -->
    <VCard>
      <VCardText>
        <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <VRow>
                   <VCol cols="12">
                     <VTextField 
                       v-model="formData.name" 
                       label="Nom du type *"
                       placeholder="Ex: Problème technique" 
                       :rules="nameRules" 
                       required
                       variant="outlined"
                       prepend-inner-icon="ri-flag-line"
                     />
                   </VCol>

            <VCol cols="12">
              <VTextarea 
                v-model="formData.description" 
                label="Description"
                placeholder="Description du type de réclamation" 
                variant="outlined" 
                rows="3"
                prepend-inner-icon="ri-file-text-line"
              />
            </VCol>

          </VRow>

          <VDivider class="my-6" />

          <div class="d-flex justify-end gap-3">
            <VBtn variant="outlined" @click="goBack" :disabled="isSubmitting">
              Annuler
            </VBtn>
            <VBtn type="submit" color="primary" :loading="isSubmitting" :disabled="!isFormValid">
              <VIcon class="mr-2">ri-save-line</VIcon>
              Créer le type
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { ReclamationTypeCreateInput } from '@/types/reclamation'

// Router
const router = useRouter()

// Composable
const { createReclamationType } = useReclamation()

// State
const formRef = ref()
const isFormValid = ref(false)
const isSubmitting = ref(false)

const formData = reactive<ReclamationTypeCreateInput>({
  name: '',
  description: ''
})

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Le nom est requis',
  (v: string) => v.length >= 2 || 'Le nom doit contenir au moins 2 caractères',
  (v: string) => v.length <= 100 || 'Le nom ne peut pas dépasser 100 caractères'
]

// Methods
const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const confirmed = await confirmAction({
    title: 'Créer le type de réclamation',
    text: `Êtes-vous sûr de vouloir créer le type "${formData.name}" ?`,
    confirmButtonText: 'Créer',
    cancelButtonText: 'Annuler'
  })

  if (!confirmed) return

  try {
    isSubmitting.value = true

    await createReclamationType(formData)

    showToast({
      message: 'Type de réclamation créé avec succès',
      type: 'success'
    })

    // Rediriger vers la liste des types
    router.push({ name: 'reclamations-types' })
  } catch (error) {
    console.error('Erreur lors de la création du type de réclamation:', error)
    showToast({
      message: 'Erreur lors de la création du type de réclamation',
      type: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push({ name: 'reclamations-types' })
}
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
