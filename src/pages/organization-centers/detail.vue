<template>
  <VContainer class="organization-center-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails du centre d'organisation</h1>
          <p class="text-body-2 text-secondary mb-0">
            Consultez les détails du centre d'organisation.
          </p>
        </div>
      </div>
      <div>
        <VBtn color="primary" variant="outlined" @click="shareCenter" prepend-icon="ri-share-line">
          Partager
        </VBtn>
        <VBtn v-if="hasUpdatePermission" color="primary" @click="editCenter" prepend-icon="ri-edit-line">
          Modifier
        </VBtn>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="center">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 organization-center-header-card overflow-hidden" elevation="3">
              <div class="organization-center-header-overlay">
                <div class="organization-center-header-content">
                  <div class="d-flex align-center mb-4 animate-specialty">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-building-2-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ getTypeLabel(center.organization_type) }}</div>
                      <div class="text-caption text-white">
                        ID: {{ center.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ center.name }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-map-pin-line</VIcon>
                      <span>{{ center.city }}, {{ center.country_code }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-phone-line</VIcon>
                      <span>{{ center.telephone_number }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-mail-line</VIcon>
                      <span>{{ center.email }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="center-status" :color="statusChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ statusChip.text }}
                    </VChip>
                    <VChip key="center-type" :color="typeChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ typeChip.text }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Informations du centre -->
              <VSlideYTransition>
                <VCard v-if="center" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations du centre</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Adresse complète</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          Adresse : {{ center.address }}<br>
                          BP : {{ center.postal_code }} {{ center.city }}<br>
                          Pays : {{ center.country_code }}
                        </div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Contact</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div>Téléphone: {{ center.telephone_number }}</div>
                          <div v-if="center.mobile_number">Mobile: {{ center.mobile_number }}</div>
                          <div>Email: {{ center.email }}</div>
                          <div v-if="center.website">Site web: {{ center.website }}</div>
                        </div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Coordonnées GPS</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div v-if="center.latitude && center.longitude">
                            Latitude: {{ center.latitude }}<br>
                            Longitude: {{ center.longitude }}
                          </div>
                          <div v-else>Coordonnées non définies</div>
                        </div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Description</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ center.description || 'Aucune description' }}</div>
                      </v-timeline-item>
                    </v-timeline>
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
                    <span class="text-h6">Informations du centre</span>
                  </VCardTitle>
                  <VDivider />
                  <VList lines="two" density="comfortable">
                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-building-2-line</VIcon>
                      </template>
                      <VListItemTitle>Type</VListItemTitle>
                      <VListItemSubtitle>{{ getTypeLabel(center.organization_type) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-map-pin-line</VIcon>
                      </template>
                      <VListItemTitle>Localisation</VListItemTitle>
                      <VListItemSubtitle>{{ center.city }}, {{ center.country_code }}</VListItemSubtitle>
                    </VListItem>
                  </VList>

                  <!-- Actions rapides -->
                  <!-- <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-3">
                      <VBtn  prepend-icon="ri-edit-line" color="primary" variant="outlined"
                        block :to="{ name: 'organization-centers-edit', params: { id: center.id } }">
                        Modifier le centre
                      </VBtn>
                      <VBtn prepend-icon="ri-toggle-line" color="warning" variant="outlined"
                        block @click="toggleStatus">
                        {{ center.status === 'ACTIVE' ? 'Désactiver' : 'Activer' }}
                      </VBtn>
                      <VBtn prepend-icon="ri-share-line" variant="outlined" block @click="shareCenter">
                        Partager le centre
                      </VBtn>
                      <VBtn v-if="hasDeletePermission" prepend-icon="ri-delete-bin-line" color="error"
                        variant="outlined" block @click="confirmDelete">
                        Supprimer
                      </VBtn>
                    </div>
                  </VCardText> -->
                </VCard>
              </VSlideXReverseTransition>

              <!-- Statistiques -->
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-bar-chart-line</VIcon>
                    <span class="text-h6">Statistiques</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-4">
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Sessions associées</span>
                        <VChip color="primary" size="small">{{ sessionsCount }}</VChip>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Formations hébergées</span>
                        <VChip color="success" size="small">{{ trainingsCount }}</VChip>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Participants</span>
                        <VChip color="info" size="small">{{ participantsCount }}</VChip>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>

              <!-- Informations système -->
              <VSlideXReverseTransition>
                <VCard class="animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations système</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-3">
                      <div>
                        <span class="text-caption text-medium-emphasis">Nom du centre</span>
                        <p class="text-body-2 font-weight-medium">{{ center.name }}</p>
                      </div>
                      <div>
                        <span class="text-caption text-medium-emphasis">Créé le</span>
                        <p class="text-body-2">{{ formatDate(center.created_at) }}</p>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- Chargement -->
    <div v-if="isLoading && !center" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement du centre...</p>
    </div>

    <!-- Erreur -->
    <VAlert
      v-if="error"
      type="error"
      class="mt-4"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </VAlert>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { organizationCentersService } from '@/services/api/organization-centers'
import type { OrganizationCenter } from '@/types/organizationCenters'
import { OrganizationStatusEnum, OrganizationTypeEnum } from '@/types/organizationCenters'
import { usePermissions } from '@/composables/usePermissions'
import { TrainingPermission } from '@/types/permissions'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const route = useRoute()
const { hasPermission } = usePermissions()

// Data
const center = ref<OrganizationCenter | null>(null)
const isLoading = ref(true)
const error = ref('')
const isDeleting = ref(false)
const sessionsCount = ref(0) // TODO: Fetch from API
const trainingsCount = ref(0) // TODO: Fetch from API
const participantsCount = ref(0) // TODO: Fetch from API

// Permissions
const hasUpdatePermission = computed(() => hasPermission(TrainingPermission.EDIT_TRAINING))
const hasDeletePermission = computed(() => hasPermission(TrainingPermission.DELETE_TRAINING))

// Computed
const statusChip = computed(() => {
  if (!center.value) return { text: '', color: 'grey' }
  
  const status = center.value.status
  const statusConfig = {
    [OrganizationStatusEnum.ACTIVE]: { text: 'Actif', color: 'success' },
    [OrganizationStatusEnum.INACTIVE]: { text: 'Inactif', color: 'error' }
  }
  
  return statusConfig[status as OrganizationStatusEnum] || { text: status, color: 'grey' }
})

const typeChip = computed(() => {
  if (!center.value) return { text: '', color: 'grey' }
  
  const type = center.value.organization_type
  const typeConfig = {
    [OrganizationTypeEnum.MAIN]: { text: 'Principal', color: 'primary' },
    [OrganizationTypeEnum.PARTNER]: { text: 'Partenaire', color: 'success' },
    [OrganizationTypeEnum.AFFILIATE]: { text: 'Affilié', color: 'info' }
  }
  
  return typeConfig[type as OrganizationTypeEnum] || { text: type, color: 'grey' }
})

// Methods
const goBack = () => {
  router.push({ name: 'organization-centers-index' })
}

const editCenter = () => {
  router.push({ name: 'organization-centers-edit', params: { id: center.value?.id } })
}

const shareCenter = () => {
  // TODO: Implement share functionality
  showToast({ message: 'Fonctionnalité de partage à implémenter', type: 'info' })
}

const toggleStatus = async () => {
  if (!center.value) return

  const newStatus = center.value.status === OrganizationStatusEnum.ACTIVE ? OrganizationStatusEnum.INACTIVE : OrganizationStatusEnum.ACTIVE
  const confirmed = await confirmAction({
    title: 'Changer le statut',
    html: `Voulez-vous ${newStatus === OrganizationStatusEnum.ACTIVE ? 'activer' : 'désactiver'} le centre <b>${center.value.name}</b> ?`,
    confirmButtonText: `<span style="color:white">Confirmer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  
  if (!confirmed) return

  try {
    await organizationCentersService.updateOrganizationCenterStatus(center.value.id, { status: newStatus })
    center.value.status = newStatus
    showToast({ message: 'Statut mis à jour avec succès', type: 'success' })
  } catch (error) {
    showToast({ message: 'Erreur lors de la mise à jour du statut', type: 'error' })
  }
}

const confirmDelete = async () => {
  if (!center.value) return

  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    html: `Souhaitez-vous réellement supprimer le centre <b>${center.value.name}</b> ?`,
    confirmButtonText: `<span style="color:white">Supprimer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  
  if (!confirmed) return

  isDeleting.value = true
  try {
    await organizationCentersService.deleteOrganizationCenter(center.value.id)
    showToast({ message: 'Centre supprimé avec succès', type: 'success' })
    router.push({ name: 'organization-centers-index' })
  } catch (error) {
    showToast({ message: 'Erreur lors de la suppression du centre', type: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const loadCenter = async () => {
  try {
    isLoading.value = true
    const centerId = route.params.id as string
    const response = await organizationCentersService.getOrganizationCenter(parseInt(centerId))
    center.value = response.data
  } catch (err) {
    console.error('Erreur lors du chargement du centre:', err)
    error.value = 'Erreur lors du chargement du centre'
  } finally {
    isLoading.value = false
  }
}

// Helper functions
const getStatusLabel = (status: string) => {
  const labels = {
    [OrganizationStatusEnum.ACTIVE]: 'Actif',
    [OrganizationStatusEnum.INACTIVE]: 'Inactif',
    [OrganizationStatusEnum.SUSPENDED]: 'Suspendu',
    [OrganizationStatusEnum.DELETED]: 'Supprimé'
  }
  return labels[status as OrganizationStatusEnum] || status
}

const getTypeLabel = (type: string) => {
  const labels = {
    [OrganizationTypeEnum.MAIN]: 'Principal',
    [OrganizationTypeEnum.BRANCH]: 'Succursale',
    [OrganizationTypeEnum.PARTNER]: 'Partenaire',
    [OrganizationTypeEnum.AFFILIATE]: 'Affilié'
  }
  return labels[type as OrganizationTypeEnum] || type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const clearError = () => {
  error.value = ''
}

// Lifecycle
onMounted(() => {
  loadCenter()
})
</script>

<style scoped>
.organization-center-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.organization-center-header-card {
  position: relative;
  overflow: hidden;
}

.organization-center-header-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.organization-center-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.organization-center-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.organization-center-header-overlay::before {
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

.organization-center-header-content {
  position: relative;
  z-index: 2;
}

.animate-specialty {
  animation: slideInLeft 0.6s ease-out;
}

.animate-title {
  animation: slideInUp 0.8s ease-out;
}

.animate-tag {
  animation: fadeInUp 1s ease-out;
}

.animate-card {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@media (max-width: 768px) {
  .organization-center-detail-container {
    padding: 1rem;
  }
}
</style>
