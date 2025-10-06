<template>
  <VContainer class="training-application-success-page">
    <VRow justify="center">
      <VCol cols="12" md="8" lg="6">
        <VCard class="text-center" elevation="3">
          <VCardText class="pa-8">
            <!-- Icône de succès -->
            <VAvatar size="80" color="success" class="mb-6">
              <VIcon icon="ri-check-line" size="40" color="white" />
            </VAvatar>

            <!-- Titre -->
            <h1 class="text-h4 mb-4 text-success">
              Candidature soumise avec succès !
            </h1>

            <!-- Message -->
            <p class="text-body-1 mb-6">
              Votre candidature pour la formation <strong>{{ trainingTitle }}</strong> a été soumise avec succès.
              Notre équipe pédagogique examinera votre dossier et vous contactera dans les plus brefs délais.
            </p>

            <!-- Informations importantes -->
            <VAlert type="info" variant="tonal" class="mb-6">
              <template #prepend>
                <VIcon icon="ri-information-line" />
              </template>
              <div>
                <strong>Prochaines étapes :</strong>
                <ul class="text-start mt-2 mb-0">
                  <li>Examen de votre dossier par notre équipe</li>
                  <li>Contact par email ou téléphone sous 48h</li>
                  <li>Confirmation de votre inscription</li>
                </ul>
              </div>
            </VAlert>

            <!-- Actions -->
            <div class="d-flex flex-column flex-sm-row gap-3 justify-center">
              <VBtn 
                color="primary" 
                size="large"
                :to="{ name: 'training-trainings-index' }"
                prepend-icon="ri-graduation-cap-line"
              >
                Voir d'autres formations
              </VBtn>
              
              <VBtn 
                v-if="trainingId"
                variant="outlined" 
                size="large"
                :to="{ name: 'training-trainings-detail', params: { id: trainingId } }"
                prepend-icon="ri-eye-line"
              >
                Voir la formation
              </VBtn>
            </div>

            <!-- Contact -->
            <VDivider class="my-6" />
            <div class="text-body-2 text-medium-emphasis">
              <VIcon icon="ri-customer-service-line" size="small" class="me-1" />
              Besoin d'aide ? Contactez-nous à 
              <a href="mailto:formations@lafaom.com" class="text-primary text-decoration-none">
                formations@lafaom.com
              </a>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { trainingService } from '@/services/api/training'

const route = useRoute()

// State
const trainingTitle = ref('')
const trainingId = ref('')

// Methods
const loadTrainingInfo = async () => {
  try {
    const trainingIdParam = route.query.trainingId as string
    if (trainingIdParam) {
      trainingId.value = trainingIdParam
      const response = await trainingService.getTrainingById(parseInt(trainingIdParam))
      trainingTitle.value = response.data.title
    }
  } catch (error) {
    console.error('Erreur lors du chargement des informations de la formation:', error)
    trainingTitle.value = 'Formation'
  }
}

// Lifecycle
onMounted(() => {
  loadTrainingInfo()
})
</script>

<style scoped>
.training-application-success-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
}
</style>
