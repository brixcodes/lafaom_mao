<template>
  <VContainer fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <VBtn
          variant="outlined"
          @click="goBack"
          prepend-icon="ri-arrow-left-line"
          class="mr-4"
        >
          Retour
        </VBtn>
        <div class="d-inline-block">
          <h1 class="text-h4 font-weight-bold mb-2">Modifier le statut</h1>
          <p class="text-body-1 text-medium-emphasis">
            {{ currentReclamation?.reclamation_number }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" size="64" />
      <p class="text-body-1 mt-4">Chargement de la réclamation...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <VIcon size="64" color="error" class="mb-4">ri-error-warning-line</VIcon>
      <h3 class="text-h6 mb-2">Erreur de chargement</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
      <VBtn color="primary" @click="loadReclamation">
        <VIcon class="mr-2">ri-refresh-line</VIcon>
        Réessayer
      </VBtn>
    </div>

    <!-- Form -->
    <div v-else-if="currentReclamation">
      <VRow justify="center">
        <VCol cols="12" md="8" lg="6">
          <VCard>
            <VCardTitle class="d-flex align-center">
              <VIcon class="mr-2">ri-edit-line</VIcon>
              Modifier le statut
            </VCardTitle>
            <VCardText>
              <VForm ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
                <VRow>
                  <!-- Statut actuel -->
                  <VCol cols="12">
                    <div class="mb-4">
                      <div class="text-body-2 text-medium-emphasis mb-2">Statut actuel</div>
                      <VChip 
                        :color="currentStatusConfig.color" 
                        variant="flat"
                        size="large"
                      >
                        <VIcon :class="currentStatusConfig.icon" class="mr-2" />
                        {{ currentStatusConfig.text }}
                      </VChip>
                    </div>
                  </VCol>

                  <!-- Nouveau statut -->
                  <VCol cols="12">
                    <VSelect
                      v-model="formData.status"
                      :items="statusOptions"
                      :rules="[rules.required]"
                      label="Nouveau statut *"
                      placeholder="Sélectionnez un statut"
                      prepend-inner-icon="ri-flag-line"
                      variant="outlined"
                    />
                  </VCol>

                  <!-- Admin assigné -->
                  <VCol cols="12">
                    <VTextField
                      v-model="formData.admin_id"
                      label="ID de l'administrateur"
                      placeholder="ID de l'admin (optionnel)"
                      prepend-inner-icon="ri-user-line"
                      variant="outlined"
                      hint="Laissez vide pour ne pas assigner d'administrateur"
                      persistent-hint
                    />
                  </VCol>

                  <!-- Commentaire -->
                  <VCol cols="12">
                    <VTextarea
                      v-model="comment"
                      label="Commentaire (optionnel)"
                      placeholder="Ajoutez un commentaire sur ce changement..."
                      prepend-inner-icon="ri-message-3-line"
                      variant="outlined"
                      rows="3"
                    />
                  </VCol>
                </VRow>

                <!-- Actions -->
                <VRow class="mt-4">
                  <VCol cols="12" class="d-flex justify-end gap-3">
                    <VBtn
                      variant="outlined"
                      @click="goBack"
                      :disabled="isSubmitting"
                    >
                      <VIcon class="mr-2">ri-close-line</VIcon>
                      Annuler
                    </VBtn>
                    
                    <VBtn
                      type="submit"
                      color="primary"
                      :loading="isSubmitting"
                      :disabled="!isValid || formData.status === currentReclamation.status"
                    >
                      <VIcon class="mr-2">ri-save-line</VIcon>
                      Mettre à jour
                    </VBtn>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import { ReclamationStatusEnum, ReclamationUpdateStatusInput } from '@/types/reclamation'

// Route & Router
const route = useRoute()
const router = useRouter()

// Composable
const {
  currentReclamation,
  isLoading,
  error,
  getReclamation,
  updateReclamationStatus,
  getStatusConfig
} = useReclamation()

// Form refs
const formRef = ref<VForm>()
const isValid = ref(false)

// State
const isSubmitting = ref(false)
const comment = ref('')

// Form data
const formData = ref<ReclamationUpdateStatusInput>({
  status: ReclamationStatusEnum.NEW,
  admin_id: ''
})

// Options
const statusOptions = [
  { title: 'Nouvelle', value: ReclamationStatusEnum.NEW },
  { title: 'En cours', value: ReclamationStatusEnum.IN_PROGRESS },
  { title: 'Fermée', value: ReclamationStatusEnum.CLOSED }
]

// Computed
const reclamationId = computed(() => Number(route.params.id))

const currentStatusConfig = computed(() => {
  if (!currentReclamation.value) return { text: '', color: '', icon: '', variant: 'flat' }
  return getStatusConfig(currentReclamation.value.status)
})

// Validation rules
const rules = {
  required: (value: any) => !!value || 'Ce champ est obligatoire'
}

// Methods
const loadReclamation = async () => {
  try {
    await getReclamation(reclamationId.value)
    if (currentReclamation.value) {
      formData.value.status = currentReclamation.value.status
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la réclamation:', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // Confirmation
  const confirmed = await confirmAction({
    title: 'Confirmer la modification',
    text: `Êtes-vous sûr de vouloir changer le statut de "${currentStatusConfig.value.text}" vers "${statusOptions.find(s => s.value === formData.value.status)?.title}" ?`,
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler'
  })

  if (!confirmed) return

  try {
    isSubmitting.value = true
    
    await updateReclamationStatus(reclamationId.value, formData.value)
    
    showToast({
      message: 'Statut mis à jour avec succès',
      type: 'success'
    })
    
    // Rediriger vers les détails
    router.push({ name: 'reclamations-detail', params: { id: reclamationId.value } })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    // L'erreur est déjà gérée dans le composable
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

// Lifecycle
onMounted(() => {
  loadReclamation()
})
</script>