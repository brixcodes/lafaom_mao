<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { trainingService } from '@/services/api/training'
import { usePermissions } from '@/composables/usePermissions'
import type { TrainingCreateInput } from '@/types/training'
import { TrainingTypeEnum, TrainingStatus, DurationEnum } from '@/types/training'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'
import QuillEditor from '@/components/common/QuillEditor.vue'

const router = useRouter()

// Permissions
const { canCreateTraining } = usePermissions()

const form = ref()
const specialties = ref<{ id: number; name: string }[]>([])
const isSaving = ref(false)
const isLoading = ref(true)

// Vérification des permissions d'accès
const hasAccess = computed(() => canCreateTraining.value)

// Options de formulaire
const trainingTypes = [
  { title: 'En présentiel', value: TrainingTypeEnum.ON_SITE },
  { title: 'À distance', value: TrainingTypeEnum.OFF_SITE },
]

const durationUnits = [
  { title: 'Heures', value: DurationEnum.HOURS },
  { title: 'Jours', value: DurationEnum.DAYS },
  { title: 'Mois', value: DurationEnum.MONTHS },
  { title: 'Années', value: DurationEnum.YEARS },
]

const statusOptions = [
  { title: 'Actif', value: TrainingStatus.ACTIVE },
  { title: 'Inactif', value: TrainingStatus.INACTIVE },
]

// Formulaire
const training = reactive<TrainingCreateInput>({
  title: '',
  status: TrainingStatus.INACTIVE,
  duration: 0,
  duration_unit: DurationEnum.HOURS,
  specialty_id: 0,
  training_type: TrainingTypeEnum.ON_SITE,
  presentation: '',
  target_skills: '',
  program: '',
  target_audience: '',
  prerequisites: '',
  enrollment: '',
})

// Chargement des spécialités
const fetchSpecialties = async () => {
  isLoading.value = true
  try {
    const response = await trainingService.getSpecialties({})
    specialties.value = response.data
  } catch (error) {
    showToast({ message: 'Erreur lors du chargement des spécialités', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

// Sauvegarde avec confirmation
const saveTraining = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return

  const confirmed = await confirmAction({
    title: 'Confirmer la création',
    text: 'Voulez-vous vraiment créer cette formation ?',
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
  })
  if (!confirmed) return

  isSaving.value = true
  try {
    await trainingService.createTraining(training)
    showToast({ message: 'Formation créée avec succès', type: 'success' })
    router.push({ name: 'training-trainings-index' })
  } catch (error) {
    showToast({ message: 'Erreur lors de la création de la formation', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push({ name: 'training-trainings-index' })
}

// Initialisation
onMounted(async () => {
  // Vérifier les permissions avant de charger la page
  // if (!hasAccess.value) {
  //   showToast({
  //     message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
  //     type: 'error'
  //   })
  //   router.push('/training/trainings')
  //   return
  // }
  
  await fetchSpecialties()
})
</script>

<template>
  <div class="training-create-page">
    <!-- Vérification des permissions d'accès -->
    <!-- <div  class="text-center py-8"> -->
      <!-- <VIcon icon="ri-shield-cross-line" size="64" color="error" />
      <h3 class="mt-4">Permission insuffisante</h3>
      <p class="text-medium-emphasis">
        Vous n'avez pas les permissions nécessaires pour créer une formation.
      </p>
      <VBtn color="primary" to="/training/trainings" class="mt-4">
        <VIcon icon="ri-arrow-left-line" class="me-2" />
        Retour aux formations
      </VBtn>
    </div> -->

    <!-- Contenu principal -->
    <div>
      <!-- En-tête avec bouton retour -->
      <div class="d-flex align-center mb-6">
        <VBtn icon="ri-arrow-left-line" variant="text" @click="goBack" class="me-3" />
        <div>
          <h1 class="text-h4 mb-1">
            Créer une formation
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Remplissez le formulaire pour créer une nouvelle formation
          </p>
        </div>
      </div>

    <!-- Formulaire -->
    <VCard>
      <VCardText>
        <VForm ref="form" @submit.prevent="saveTraining">
          <VRow>
            <!-- Titre -->
            <VCol cols="12" md="6">
              <VTextField v-model="training.title" label="Titre de la formation" prepend-inner-icon="ri-file-text-line"
                :rules="[v => !!v || 'Le titre est requis']" required />
            </VCol>

            <!-- Spécialité -->
            <VCol cols="12" md="6">
              <VAutocomplete v-model="training.specialty_id" :items="specialties" item-title="name" item-value="id"
                label="Spécialité" prepend-inner-icon="ri-bookmark-line" :loading="isLoading"
                :rules="[v => !!v || 'La spécialité est requise']" required />
            </VCol>

            <!-- Type de formation -->
            <VCol cols="12" md="3">
              <VAutocomplete v-model="training.training_type" :items="trainingTypes" item-title="title"
                item-value="value" label="Type de formation" prepend-inner-icon="ri-article-line"
                :rules="[v => !!v || 'Le type de formation est requis']" required />
            </VCol>

            <!-- Statut -->
            <VCol cols="12" md="3">
              <VAutocomplete v-model="training.status" :items="statusOptions" item-title="title" item-value="value"
                label="Statut" prepend-inner-icon="ri-toggle-line" :rules="[v => !!v || 'Le statut est requis']"
                required />
            </VCol>

            <!-- Durée -->
            <VCol cols="12" md="3">
              <VTextField v-model.number="training.duration" label="Durée" type="number"
                prepend-inner-icon="ri-timer-line" :rules="[
                  v => !!v || 'La durée est requise',
                  v => v > 0 || 'La durée doit être supérieure à 0'
                ]" required />
            </VCol>

            <!-- Unité de durée -->
            <VCol cols="12" md="3">
              <VAutocomplete v-model="training.duration_unit" :items="durationUnits" item-title="title"
                item-value="value" label="Unité de durée" prepend-inner-icon="ri-calendar-2-line"
                :rules="[v => !!v || 'L\'unité de durée est requise']" required />
            </VCol>

             <!-- Présentation -->
             <VCol cols="12">
               <QuillEditor 
                 key="presentation-editor" 
                 editor-id="presentation-editor" 
                 v-model="training.presentation"
                 label="Présentation"
                 placeholder="Contexte, défis et vision globale de la formation"
                 :rules="[(v: string) => !!v || 'La présentation est requise']"
                 required
               />
             </VCol>
 
             <!-- Compétences cibles -->
             <VCol cols="12" md="6">
               <QuillEditor 
                 key="target-skills-editor" 
                 editor-id="target-skills-editor" 
                 v-model="training.target_skills"
                 label="Compétences cibles"
                 placeholder="Compétences et savoir-faire à acquérir"
                 :rules="[(v: string) => !!v || 'Les compétences cibles sont requises']"
                 required
               />
             </VCol>
 
             <!-- Programme -->
             <VCol cols="12" md="6">
               <QuillEditor 
                 key="program-editor" 
                 editor-id="program-editor" 
                 v-model="training.program"
                 label="Programme détaillé"
                 placeholder="Contenu et structure détaillée de la formation"
                 :rules="[(v: string) => !!v || 'Le programme est requis']"
                 required
               />
             </VCol>
 
             <!-- Public cible -->
             <VCol cols="12" md="6">
               <QuillEditor 
                 key="target-audience-editor" 
                 editor-id="target-audience-editor" 
                 v-model="training.target_audience"
                 label="Public cible"
                 placeholder="Public visé et prérequis"
                 :rules="[(v: string) => !!v || 'Le public cible est requis']"
                 required
               />
             </VCol>
 
             <!-- Prérequis -->
             <VCol cols="12" md="6">
               <QuillEditor 
                 key="prerequisites-editor" 
                 editor-id="prerequisites-editor" 
                 v-model="training.prerequisites"
                 label="Prérequis"
                 placeholder="Prérequis nécessaires pour suivre la formation"
               />
             </VCol>

             <!-- Inscription -->
             <VCol cols="12">
               <QuillEditor 
                 key="enrollment-editor" 
                 editor-id="enrollment-editor" 
                 v-model="training.enrollment"
                 label="Modalités d'inscription"
                 placeholder="Méthodes d'inscription, durée, rythme"
                 :rules="[(v: string) => !!v || 'Les modalités d\'inscription sont requises']"
                 required
               />
             </VCol>
          </VRow>
          <VDivider class="my-4" />
          <VCardActions class="justify-end">
            <VBtn color="error" variant="flat" size="large" @click="goBack">
              Annuler
            </VBtn>
            <VBtn color="primary" variant="flat" size="large" type="submit" :loading="isSaving">
              Enregistrer
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
    </div>
  </div>
</template>

<style scoped>
.training-create-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .training-create-page {
    padding: 1rem;
  }
}
</style>
