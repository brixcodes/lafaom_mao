<template>
    <VContainer fluid>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-6">
            <div>
                <h1 class="text-h4 font-weight-bold mb-2">
                    <VIcon icon="ri-arrow-left-line" variant="outlined" color="primary" class="mr-3" @click="goBack" />
                    Modifier le type de réclamation
                </h1>
                <p class="text-body-1 text-medium-emphasis">
                    Modifiez les informations de ce type de réclamation
                </p>
            </div>
        </div>

        <!-- Contenu -->
        <div v-if="isLoading" class="text-center py-8">
            <VProgressCircular indeterminate color="primary" size="64" />
            <p class="text-body-1 mt-4">Chargement du type de réclamation...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
            <VIcon size="64" color="error" class="mb-4">ri-error-warning-line</VIcon>
            <h3 class="text-h6 mb-2">Erreur de chargement</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
            <VBtn color="primary" @click="loadReclamationType">
                <VIcon class="mr-2">ri-refresh-line</VIcon>
                Réessayer
            </VBtn>
        </div>

        <div v-else-if="currentReclamationType" class="mb-6">
            <!-- Formulaire de modification -->
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
                                Sauvegarder
                            </VBtn>
                        </div>
                    </VForm>
                </VCardText>
            </VCard>
        </div>

        <div v-else class="text-center py-8">
            <VIcon size="64" color="medium-emphasis" class="mb-4">ri-question-line</VIcon>
            <h3 class="text-h6 mb-2">Type de réclamation non trouvé</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
                Ce type de réclamation n'existe pas ou a été supprimé.
            </p>
            <VBtn color="primary" @click="goBack">
                <VIcon class="mr-2">ri-arrow-left-line</VIcon>
                Retour à la liste
            </VBtn>
        </div>
    </VContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { ReclamationTypeUpdateInput } from '@/types/reclamation'

// Router
const router = useRouter()
const route = useRoute()

// Composable
const {
    isLoading,
    error,
    getReclamationType,
    updateReclamationType
} = useReclamation()

// Local state
const currentReclamationType = ref<any>(null)

// State
const formRef = ref()
const isFormValid = ref(false)
const isSubmitting = ref(false)
const reclamationTypeId = ref<number>(parseInt(route.params.id as string))

const formData = reactive<ReclamationTypeUpdateInput>({
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
const loadReclamationType = async () => {
    try {
        const result = await getReclamationType(reclamationTypeId.value)
        currentReclamationType.value = result

        // Pré-remplir le formulaire
        if (currentReclamationType.value) {
            formData.name = currentReclamationType.value.name
            formData.description = currentReclamationType.value.description || ''
        }
    } catch (error) {
        console.error('Erreur lors du chargement du type de réclamation:', error)
        showToast({
            message: 'Erreur lors du chargement du type de réclamation',
            type: 'error'
        })
    }
}

const handleSubmit = async () => {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    // Confirmation
    const confirmed = await confirmAction({
        title: 'Confirmer la modification',
        text: 'Êtes-vous sûr de vouloir modifier ce type de réclamation ?',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
    })

    if (!confirmed) return

    try {
        isSubmitting.value = true

        await updateReclamationType(reclamationTypeId.value, formData)

        showToast({
            message: 'Type de réclamation modifié avec succès',
            type: 'success'
        })

        // Rediriger vers la liste des types
        router.push({ name: 'reclamations-types' })
    } catch (error) {
        console.error('Erreur lors de la modification du type de réclamation:', error)
        showToast({
            message: 'Erreur lors de la modification du type de réclamation',
            type: 'error'
        })
    } finally {
        isSubmitting.value = false
    }
}

const goBack = () => {
    router.push({ name: 'reclamations-types' })
}

// Lifecycle
onMounted(() => {
    loadReclamationType()
})
</script>

<style scoped>
.v-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
