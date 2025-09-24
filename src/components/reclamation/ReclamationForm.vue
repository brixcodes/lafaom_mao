<template>
  <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
    <VRow>
      <VCol cols="12" md="6">
        <VSelect 
          :model-value="props.modelValue.application_number" 
          @update:model-value="(value) => emit('update:modelValue', { ...props.modelValue, application_number: value })" 
          label="Numéro de candidature" 
          placeholder="Sélectionnez une candidature"
          :items="applicationNumberOptions"
          :rules="applicationNumberRules" 
          required 
          variant="outlined" 
          prepend-inner-icon="ri-file-list-3-line"
          :loading="isLoadingApplications"
          :disabled="isLoadingApplications"
        />
        <VAlert 
          v-if="!isLoadingApplications && applicationNumberOptions.length === 0" 
          type="warning" 
          variant="tonal" 
          class="mt-2"
        >
          <template #title>Aucune candidature trouvée</template>
          Vous devez d'abord créer une candidature pour pouvoir faire une réclamation.
        </VAlert>
      </VCol>

      <VCol cols="12" md="6">
        <VSelect :model-value="props.modelValue.reclamation_type" @update:model-value="(value) => emit('update:modelValue', { ...props.modelValue, reclamation_type: value })" label="Type de réclamation" :items="reclamationTypeOptions"
          :rules="typeRules" required variant="outlined" prepend-inner-icon="ri-flag-line" />
      </VCol>

      <VCol cols="12">
        <VTextField :model-value="props.modelValue.subject" @update:model-value="(value) => emit('update:modelValue', { ...props.modelValue, subject: value })" label="Sujet" placeholder="Résumé du problème" :rules="subjectRules"
          required variant="outlined" prepend-inner-icon="ri-text" />
      </VCol>

      <VCol cols="12" md="12">
        <VSelect :model-value="props.modelValue.priority" @update:model-value="(value) => emit('update:modelValue', { ...props.modelValue, priority: value })" label="Priorité" :items="priorityOptions" :rules="priorityRules" required
          variant="outlined" prepend-inner-icon="ri-flag-line" />
      </VCol>

      <VCol cols="12">
        <VTextarea :model-value="props.modelValue.description" @update:model-value="(value) => emit('update:modelValue', { ...props.modelValue, description: value })" label="Description détaillée"
          placeholder="Décrivez le problème en détail..." :rules="descriptionRules" required variant="outlined" rows="4"
          prepend-inner-icon="ri-file-text-line" />
      </VCol>
    </VRow>

    <VDivider class="my-6" />

    <div class="d-flex justify-end gap-3">
      <VBtn variant="outlined" @click="$emit('cancel')" :disabled="isSubmitting">
        Annuler
      </VBtn>
      <VBtn type="submit" color="primary" :loading="isSubmitting" :disabled="!isFormValid">
        <VIcon class="mr-2">ri-save-line</VIcon>
        {{ isSubmitting ? 'Enregistrement...' : 'Soumettre' }}
      </VBtn>
    </div>
  </VForm>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useStudentApplication } from '@/composables/useStudentApplication'
import type { ReclamationCreateInput, ReclamationType } from '@/types/reclamation'

interface Props {
  modelValue: ReclamationCreateInput
  reclamationTypes: ReclamationType[]
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false
})

const emit = defineEmits<{
  'update:modelValue': [value: ReclamationCreateInput]
  submit: [data: ReclamationCreateInput]
  cancel: []
}>()

// State
const formRef = ref()
const isFormValid = ref(false)

// Student applications
const { loadMyApplications, applications, isLoading: isLoadingApplications } = useStudentApplication()

// Options
const priorityOptions = [
  { title: 'Faible', value: 'LOW' },
  { title: 'Moyenne', value: 'MEDIUM' },
  { title: 'Élevée', value: 'HIGH' }
]

const reclamationTypeOptions = computed(() => {
  return props.reclamationTypes.map(type => ({
    title: type.name,
    value: type.id
  }))
})

const applicationNumberOptions = computed(() => {
  return applications.value.map(app => ({
    title: `${app.application_number} - ${app.training_title || 'Formation'}`,
    value: app.application_number
  }))
})

// Validation rules
const applicationNumberRules = [
  (v: string) => !!v || 'Le numéro de candidature est requis'
]

const typeRules = [
  (v: number) => !!v || 'Le type de réclamation est requis'
]

const subjectRules = [
  (v: string) => !!v || 'Le sujet est requis',
  (v: string) => v.length >= 5 || 'Le sujet doit contenir au moins 5 caractères',
  (v: string) => v.length <= 200 || 'Le sujet ne peut pas dépasser 200 caractères'
]

const priorityRules = [
  (v: string) => !!v || 'La priorité est requise'
]

const descriptionRules = [
  (v: string) => !!v || 'La description est requise',
  (v: string) => v.length >= 10 || 'La description doit contenir au moins 10 caractères',
  (v: string) => v.length <= 2000 || 'La description ne peut pas dépasser 2000 caractères'
]

// Methods
const handleSubmit = () => {
  emit('submit', props.modelValue)
}

// Lifecycle
onMounted(async () => {
  console.log('🔍 Chargement des candidatures de l\'utilisateur...')
  
  // Attendre un peu que l'utilisateur soit chargé
  await new Promise(resolve => setTimeout(resolve, 100))
  
  await loadMyApplications(true)
  console.log('📋 Candidatures chargées:', applications.value)
  console.log('📋 Options de candidatures:', applicationNumberOptions.value)
})
</script>

<style scoped>
.v-form {
  max-width: 100%;
}
</style>
