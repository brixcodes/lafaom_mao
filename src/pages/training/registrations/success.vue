<template>
  <VContainer class="registration-success-container">
    <div class="text-center">
      <!-- Icône de succès -->
      <VSlideYTransition>
        <div class="mb-6">
          <VAvatar size="120" color="success" class="mb-4">
            <VIcon size="60" color="white">ri-check-line</VIcon>
          </VAvatar>
          <h1 class="text-h3 font-weight-bold mb-4">Inscription réussie !</h1>
          <p class="text-h6 text-medium-emphasis mb-6">
            Votre inscription a été soumise avec succès
          </p>
        </div>
      </VSlideYTransition>

      <!-- Détails de l'inscription -->
      <VSlideYTransition>
        <VCard class="mx-auto mb-6" max-width="600" elevation="2">
          <VCardTitle class="d-flex align-center justify-center">
            <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
            <span class="text-h6">Détails de votre inscription</span>
          </VCardTitle>
          <VDivider />
          <VCardText class="py-6">
            <VRow>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <h4 class="text-subtitle-1 mb-2">Type d'inscription</h4>
                  <p class="text-body-1">{{ registrationType }}</p>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <h4 class="text-subtitle-1 mb-2">Date d'inscription</h4>
                  <p class="text-body-1">{{ formatDate(new Date()) }}</p>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <h4 class="text-subtitle-1 mb-2">Email de confirmation</h4>
                  <p class="text-body-1">{{ userEmail }}</p>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <h4 class="text-subtitle-1 mb-2">Statut</h4>
                  <VChip color="success" size="small">
                    En attente de confirmation
                  </VChip>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VSlideYTransition>

      <!-- Prochaines étapes -->
      <VSlideYTransition>
        <VCard class="mx-auto mb-6" max-width="600" elevation="1">
          <VCardTitle class="d-flex align-center justify-center">
            <VIcon color="primary" class="mr-2">ri-calendar-line</VIcon>
            <span class="text-h6">Prochaines étapes</span>
          </VCardTitle>
          <VDivider />
          <VCardText class="py-4">
            <v-timeline align="start" density="compact" class="pa-3">
              <v-timeline-item size="x-small">
                <div class="font-weight-medium mb-2"><strong>1. Confirmation par email</strong></div>
                <div style="margin-left: 10px; line-height: 1.8;">
                  Vous recevrez un email de confirmation dans les prochaines minutes.
                </div>
              </v-timeline-item>
              <v-timeline-item size="x-small">
                <div class="font-weight-medium mb-2"><strong>2. Validation de l'inscription</strong></div>
                <div style="margin-left: 10px; line-height: 1.8;">
                  Notre équipe validera votre inscription et vous contactera si nécessaire.
                </div>
              </v-timeline-item>
              <v-timeline-item size="x-small">
                <div class="font-weight-medium mb-2"><strong>3. Informations de la session</strong></div>
                <div style="margin-left: 10px; line-height: 1.8;">
                  Vous recevrez toutes les informations pratiques avant le début de la formation.
                </div>
              </v-timeline-item>
            </v-timeline>
          </VCardText>
        </VCard>
      </VSlideYTransition>

      <!-- Actions -->
      <VSlideYTransition>
        <div class="d-flex flex-column flex-md-row gap-4 justify-center">
          <VBtn
            color="primary"
            size="large"
            prepend-icon="ri-home-line"
            @click="goToHome"
          >
            Retour à l'accueil
          </VBtn>
          <VBtn
            variant="outlined"
            size="large"
            prepend-icon="ri-calendar-line"
            @click="goToSessions"
          >
            Voir les sessions
          </VBtn>
          <VBtn
            variant="outlined"
            size="large"
            prepend-icon="ri-graduation-cap-line"
            @click="goToTrainings"
          >
            Voir les formations
          </VBtn>
        </div>
      </VSlideYTransition>

      <!-- Informations de contact -->
      <VSlideYTransition>
        <VCard class="mx-auto mt-6" max-width="600" elevation="1">
          <VCardTitle class="d-flex align-center justify-center">
            <VIcon color="primary" class="mr-2">ri-customer-service-line</VIcon>
            <span class="text-h6">Besoin d'aide ?</span>
          </VCardTitle>
          <VDivider />
          <VCardText class="py-4">
            <div class="text-center">
              <p class="text-body-1 mb-4">
                Si vous avez des questions concernant votre inscription, n'hésitez pas à nous contacter.
              </p>
              <div class="d-flex flex-column flex-md-row gap-4 justify-center">
                <VBtn variant="outlined" prepend-icon="ri-mail-line">
                  Nous contacter
                </VBtn>
                <VBtn variant="outlined" prepend-icon="ri-phone-line">
                  Appeler le support
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VSlideYTransition>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// State
const registrationType = ref('Session de formation')
const userEmail = ref('')

// Computed
const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Methods
const goToHome = () => {
  router.push({ name: 'dashboard' })
}

const goToSessions = () => {
  router.push({ name: 'training-sessions-index' })
}

const goToTrainings = () => {
  router.push({ name: 'training-trainings-index' })
}

// Lifecycle
onMounted(() => {
  // Récupérer les informations depuis les paramètres de route ou le localStorage
  const type = route.query.type as string || 'Session de formation'
  const email = route.query.email as string || 'user@example.com'
  
  registrationType.value = type
  userEmail.value = email
})
</script>

<style scoped>
.registration-success-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

@media (max-width: 768px) {
  .registration-success-container {
    padding: 1rem;
  }
}
</style>
