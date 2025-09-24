<template>
  <div class="job-application-success-page">
    <div class="text-center pa-12">
      <!-- Icône de succès -->
      <VIcon 
        icon="ri-check-circle-line" 
        size="120" 
        color="success" 
        class="mb-6" 
      />

      <!-- Titre -->
      <h1 class="text-h3 mb-4 text-success">
        Candidature envoyée avec succès !
      </h1>

      <!-- Message -->
      <p class="text-h6 mb-6 text-medium-emphasis">
        Votre candidature a été transmise avec succès.
      </p>

      <p class="text-body-1 mb-8 text-medium-emphasis max-width-600 mx-auto">
        Nous avons bien reçu votre candidature et tous vos documents. 
        Notre équipe va examiner votre dossier et vous contacter dans les plus brefs délais 
        si votre profil correspond à nos attentes.
      </p>

      <!-- Informations importantes -->
      <VCard class="mx-auto mb-8" max-width="600" variant="outlined">
        <VCardText class="pa-6">
          <div class="d-flex align-center mb-4">
            <VIcon icon="ri-information-line" color="info" class="me-2" />
            <span class="text-h6">Prochaines étapes</span>
          </div>
          
          <div class="text-start">
            <div class="d-flex align-start mb-3">
              <VIcon icon="ri-mail-line" size="20" color="medium-emphasis" class="me-3 mt-1" />
              <div>
                <p class="text-body-2 font-weight-medium mb-1">Confirmation par email</p>
                <p class="text-body-2 text-medium-emphasis">
                  Vous recevrez un email de confirmation avec votre numéro de candidature.
                </p>
              </div>
            </div>
            
            <div class="d-flex align-start mb-3">
              <VIcon icon="ri-search-line" size="20" color="medium-emphasis" class="me-3 mt-1" />
              <div>
                <p class="text-body-2 font-weight-medium mb-1">Examen du dossier</p>
                <p class="text-body-2 text-medium-emphasis">
                  Notre équipe RH va étudier votre candidature sous 5 jours ouvrables.
                </p>
              </div>
            </div>
            
            <div class="d-flex align-start">
              <VIcon icon="ri-phone-line" size="20" color="medium-emphasis" class="me-3 mt-1" />
              <div>
                <p class="text-body-2 font-weight-medium mb-1">Prise de contact</p>
                <p class="text-body-2 text-medium-emphasis">
                  Si votre profil est retenu, nous vous contacterons pour un entretien.
                </p>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>

      <!-- Actions -->
      <div class="d-flex justify-center gap-4">
        <VBtn
          prepend-icon="ri-briefcase-line"
          color="primary"
          variant="outlined"
          size="large"
          :to="{ name: 'job-offers-list' }"
        >
          Voir d'autres offres
        </VBtn>
        
        <VBtn
          v-if="offerId"
          prepend-icon="ri-arrow-left-line"
          color="primary"
          size="large"
          :to="{ name: 'job-offers-detail', params: { id: offerId } }"
        >
          Retour à l'offre
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Composables
const route = useRoute()

// State
const offerId = ref<string | null>(null)

// Lifecycle
onMounted(() => {
  offerId.value = route.query.offerId as string || null
})
</script>

<style scoped>
.job-application-success-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.max-width-600 {
  max-width: 600px;
}

@media (max-width: 768px) {
  .job-application-success-page {
    padding: 1rem;
  }
  
  .d-flex.gap-4 {
    flex-direction: column;
    align-items: center;
  }
  
  .d-flex.gap-4 .v-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>