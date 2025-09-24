<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSpecialtyStore } from '@/stores/specialty'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'

const props = defineProps<{ specialtyId?: number }>()
const specialtyStore = useSpecialtyStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  name: '',
  description: '',
})

const formRef = ref() // Référence du VForm
const isFormValid = ref(false) // Suivi de la validité globale du formulaire

const rules = {
  name: [
    (v: string) => !!v || 'Le nom est requis',
    (v: string) => (v && v.length >= 3) || 'Le nom doit contenir au moins 3 caractères',
    (v: string) => (v && v.length <= 64) || 'Le nom doit contenir au maximum 64 caractères',
  ],
  description: [
    (v: string) => !v || v.length <= 255 || 'La description doit contenir au maximum 255 caractères',
  ],
}

onMounted(async () => {
  const id = props.specialtyId ?? (route.params.id ? Number(route.params.id) : undefined)
  if (id) {
    try {
      const specialty = await specialtyStore.getSpecialtyById(id)
      form.value = {
        name: specialty.name,
        description: specialty.description || '',
      }
    } catch (error) {
      showToast({ message: 'Erreur lors du chargement de la spécialité', type: 'error' })
      router.push({ name: 'training-specialties-index' })
    }
  }
})

const isLoading = computed(() => specialtyStore.isLoading)

const handleSubmit = async () => {
  // On valide le formulaire
  const { valid } = await formRef.value.validate()
  isFormValid.value = valid
  if (!valid) return // si invalide → stop

  // Confirmation uniquement si le formulaire est valide
  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    text: (props.specialtyId ?? route.params.id)
      ? 'Souhaitez-vous réellement modifier cette spécialité ?'
      : 'Souhaitez-vous réellement créer cette spécialité ?',
    confirmButtonText: '<span style="color:white">Confirmer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  if (!confirmed) return

  try {
    const id = props.specialtyId ?? (route.params.id ? Number(route.params.id) : undefined)
    if (id) {
      await specialtyStore.updateSpecialty(id, form.value)
      showToast({ message: 'Spécialité modifiée avec succès', type: 'success' })
    } else {
      await specialtyStore.createSpecialty(form.value)
      showToast({ message: 'Spécialité créée avec succès', type: 'success' })
    }
    router.push({ name: 'training-specialties-index' })
  } catch (error) {
    showToast({ message: 'Erreur lors de l\'enregistrement de la spécialité', type: 'error' })
  }
}

const clearForm = () => {
  form.value = {
    name: '',
    description: '',
  }
}
</script>

<template>
  <div class="d-flex align-center mb-4">
    <VBtn
      icon
      variant="text"
      class="mr-3"
      aria-label="Retour"
      title="Retour"
      @click="() => router.push('/training/specialties')"
    >
      <VIcon icon="ri-arrow-left-line" color="primary" />
    </VBtn>
    <div>
      <h1 class="font-weight-bold mb-1">
        {{ (props.specialtyId ?? (route.params.id ? Number(route.params.id) : undefined)) ? 'Modifier une spécialité' : 'Créer une spécialité' }}
      </h1>
      <p class="text-body-2 text-secondary mb-0">
        {{ (props.specialtyId ?? (route.params.id ? Number(route.params.id) : undefined)) 
            ? "Remplissez le formulaire et modifiez les informations de la spécialité de formation." 
            : "Remplissez le formulaire pour ajouter une spécialité des formations." }}
      </p>
    </div>
  </div>

  <VContainer>
    <VCard elevation="2" class="pa-4">
      <VCardText>
        <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <VTextField
            v-model="form.name"
            label="Nom de la spécialité"
            placeholder="Saisir le nom de la spécialité"
            prepend-inner-icon="ri-bookmark-line"
            :rules="rules.name"
            required
          />

          <VTextarea
            v-model="form.description"
            label="Description (optionnelle)"
            placeholder="Saisir une description (255 caractères max)"
            :rules="rules.description"
            rows="3"
            class="mt-4"
            prepend-inner-icon="ri-align-left"
          />

          <VDivider class="my-4" />
          <VCardActions class="justify-end">
            <VBtn color="error" variant="flat" size="large" @click="clearForm">
              Annuler
            </VBtn>
            <VBtn
              color="primary"
              variant="flat"
              size="large"
              :loading="isLoading"
              type="submit"
              :disabled="!isFormValid"
            >
              {{ (props.specialtyId ?? (route.params.id ? Number(route.params.id) : undefined)) ? 'Modifier' : 'Enregistrer' }}
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
  </VContainer>
</template>
