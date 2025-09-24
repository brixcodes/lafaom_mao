<template>
  <VContainer class="specialty-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Partie gauche : bouton retour + titres -->
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails de la spécialité</h1>
          <p class="text-body-2 text-secondary mb-0">
            Consultez les informations détaillées de la spécialité.
          </p>
        </div>
      </div>

      <!-- Partie droite : boutons d'action -->
      <div>
        <VBtn color="primary" variant="outlined" @click="goToEdit" class="action-btn mx-1" prepend-icon="ri-edit-line">
          Modifier
        </VBtn>
        <VBtn color="primary" @click="goToIndex" class="action-btn" prepend-icon="ri-list-line">
          Liste
        </VBtn>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement de la spécialité...</p>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mb-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <VFadeTransition>
      <VRow v-if="currentSpecialty">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 specialty-header-card overflow-hidden" elevation="3">
              <div class="specialty-header-overlay">
                <div class="specialty-header-content">
                  <div class="d-flex align-center mb-4 animate-company">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-award-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">Spécialité de formation</div>
                      <div class="text-caption text-white">
                        ID: {{ currentSpecialty.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ currentSpecialty.name }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>Créée le {{ formatDate(currentSpecialty.created_at) }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-edit-line</VIcon>
                      <span>Modifiée le {{ formatDate(currentSpecialty.updated_at) }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="specialty" color="white" variant="elevated" size="small" class="mr-2 mb-2 animate-tag">
                      Spécialité
                    </VChip>
                    <VChip key="active" color="success" variant="elevated" size="small" class="mr-2 mb-2 animate-tag">
                      Active
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Description -->
              <VSlideYTransition>
                <VCard v-if="currentSpecialty.description" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-file-text-line</VIcon>
                    <span class="text-h6">Description de la spécialité</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 specialty-content">
                    <div v-html="currentSpecialty.description"></div>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Informations générales -->
              <VSlideYTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations générales</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 specialty-content">
                    <VRow>
                      <VCol cols="12" md="6">
                        <div class="mb-4">
                          <h4 class="text-h6 mb-2">Nom de la spécialité</h4>
                          <p class="text-body-1 font-weight-medium">{{ currentSpecialty.name }}</p>
                        </div>
                      </VCol>
                      <VCol cols="12" md="6">
                        <div class="mb-4">
                          <h4 class="text-h6 mb-2">Identifiant</h4>
                          <p class="text-body-1 font-weight-medium">#{{ currentSpecialty.id }}</p>
                        </div>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>

            <!-- Sidebar avec informations et actions -->
            <VCol cols="12" md="4">
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations de la spécialité</span>
                  </VCardTitle>
                  <VDivider />
                  <VList lines="two" density="comfortable">
                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-award-line</VIcon>
                      </template>
                      <VListItemTitle>Nom</VListItemTitle>
                      <VListItemSubtitle>{{ currentSpecialty.name }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-hashtag</VIcon>
                      </template>
                      <VListItemTitle>Identifiant</VListItemTitle>
                      <VListItemSubtitle>#{{ currentSpecialty.id }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-calendar-todo-line</VIcon>
                      </template>
                      <VListItemTitle>Date de création</VListItemTitle>
                      <VListItemSubtitle>{{ formatDate(currentSpecialty.created_at) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-edit-line</VIcon>
                      </template>
                      <VListItemTitle>Dernière modification</VListItemTitle>
                      <VListItemSubtitle>{{ formatDate(currentSpecialty.updated_at) }}</VListItemSubtitle>
                    </VListItem>
                  </VList>

                  <!-- Actions -->
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="text-subtitle-2 mb-3">Actions disponibles</div>
                    <div class="d-flex flex-column gap-2">
                      <VBtn color="primary" variant="outlined" prepend-icon="ri-edit-line" @click="goToEdit" block>
                        Modifier la spécialité
                      </VBtn>
                      <VBtn color="error" variant="outlined" prepend-icon="ri-delete-bin-line" @click="confirmDelete"
                        block>
                        Supprimer la spécialité
                      </VBtn>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- Spécialité non trouvée -->
    <VFadeTransition>
      <VCard v-if="!isLoading && !currentSpecialty && !error">
        <VCardText class="text-center py-12">
          <VIcon icon="ri-error-warning-line" size="60" class="text-error mb-4" />
          <h3 class="text-h5 mb-2">Spécialité non trouvée</h3>
          <p class="text-body-1 text-medium-emphasis mb-4">
            La spécialité que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <VBtn color="primary" :to="{ name: 'specialties-index' }">
            Retour à la liste
          </VBtn>
        </VCardText>
      </VCard>
    </VFadeTransition>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSpecialtyStore } from '@/stores/specialties'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { Specialty } from '@/types/specialties'

const router = useRouter()
const route = useRoute()
const specialtyStore = useSpecialtyStore()

// State
const error = ref('')
const currentSpecialty = ref<Specialty | null>(null)

// Computed
const isLoading = computed(() => specialtyStore.isLoading)
const specialtyId = computed(() => route.params.id as string)

// Methods
const loadSpecialty = async () => {
  try {
    const id = parseInt(specialtyId.value)
    currentSpecialty.value = await specialtyStore.fetchSpecialty(id)
  } catch (err: any) {
    console.error('Erreur lors du chargement de la spécialité:', err)
    error.value = 'Erreur lors du chargement de la spécialité'
  }
}

const confirmDelete = async () => {
  if (!currentSpecialty.value) return

  const confirmed = await confirmAction({
    title: 'Supprimer la spécialité',
    text: `Êtes-vous sûr de vouloir supprimer la spécialité "${currentSpecialty.value.name}" ? Cette action est irréversible.`,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (confirmed) {
    try {
      const id = parseInt(specialtyId.value)
      await specialtyStore.deleteSpecialty(id)
      showToast({ message: 'Spécialité supprimée avec succès', type: 'success' })
      router.push({ name: 'specialties-index' })
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err)
      showToast({ message: 'Erreur lors de la suppression', type: 'error' })
    }
  }
}

const clearError = () => {
  error.value = ''
}

const goBack = () => {
  router.back()
}

const goToEdit = () => {
  router.push({ name: 'specialties-edit', params: { id: specialtyId.value } })
}

const goToIndex = () => {
  router.push({ name: 'specialties-index' })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadSpecialty()
})
</script>

<style scoped>
.specialty-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.specialty-header-card {
  position: relative;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.specialty-header-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.specialty-header-overlay {
  position: relative;
  min-height: 300px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  transition: background-color 0.3s ease;
}

.specialty-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.specialty-header-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.specialty-header-content {
  position: relative;
  width: 100%;
  padding: 2rem;
  z-index: 1;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.specialty-content {
  line-height: 1.7;
}

.specialty-content h1,
.specialty-content h2,
.specialty-content h3 {
  color: rgb(var(--v-theme-primary));
  margin: 1.5rem 0 1rem 0;
}

.specialty-content ul,
.specialty-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.specialty-content li {
  margin: 0.5rem 0;
}

.specialty-content p {
  margin: 1rem 0;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
.animate-title {
  animation: fadeInUp 0.8s ease-out;
}

.animate-company {
  animation: fadeInUp 0.8s ease-out 0.2s;
  animation-fill-mode: both;
}

.animate-tag {
  transition: all 0.3s ease;
}

.animate-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.animate-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animate-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Responsive design */
@media (max-width: 960px) {
  .specialty-header-card {
    min-height: 250px;
  }

  .specialty-header-overlay {
    min-height: 250px;
    padding: 1.5rem;
  }

  .specialty-header-content {
    padding: 1.5rem;
  }

  .animate-title {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 600px) {
  .specialty-header-overlay {
    min-height: 200px;
  }

  .specialty-header-content {
    padding: 1rem;
  }

  .animate-title {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
  }

  .animate-tag {
    margin-bottom: 0.5rem;
  }

  .action-btn {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .specialty-header-overlay {
    min-height: 180px;
  }

  .animate-title {
    font-size: 1.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .animate-company {
    flex-direction: column;
    align-items: flex-start;
  }

  .animate-company .v-avatar {
    margin-bottom: 0.5rem;
  }
}
</style>
