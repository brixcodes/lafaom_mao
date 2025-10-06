<template>
  <VCard class="student-application-card" elevation="1" :class="{ 'selected': isSelected }">
    <VCardText class="pa-4">
      <!-- Header avec numéro de candidature et statut -->
      <div class="d-flex justify-space-between align-center mb-3">
        <div class="d-flex align-center">
          <VIcon color="primary" class="mr-2">ri-file-list-line</VIcon>
          <span class="text-subtitle-2 font-weight-medium">{{ application.application_number }}</span>
        </div>
        <VChip :color="statusChip.color" size="small" variant="elevated">
          <VIcon :icon="statusChip.icon" size="small" class="mr-1" />
          {{ statusChip.text }}
        </VChip>
      </div>

      <!-- Informations de la formation -->
      <div class="mb-3">
        <h4 class="text-subtitle-1 font-weight-medium mb-1">{{ application.training_title }}</h4>
        <div class="d-flex align-center text-caption text-medium-emphasis">
          <VIcon size="small" class="mr-1">ri-calendar-line</VIcon>
          <span>{{ formatDate(application.training_session_start_date) }} - {{
            formatDate(application.training_session_end_date) }}</span>
        </div>
      </div>

      <!-- Informations de l'utilisateur -->
      <div class="mb-3">
        <div class="d-flex align-center mb-1">
          <VIcon size="small" class="mr-2">ri-user-line</VIcon>
          <span class="text-body-2">{{ application.user_first_name }} {{ application.user_last_name }}</span>
        </div>
        <div class="d-flex align-center text-caption text-medium-emphasis">
          <VIcon size="small" class="mr-1">ri-mail-line</VIcon>
          <span>{{ application.user_email }}</span>
        </div>
      </div>

      <!-- Frais -->
      <div v-if="application.registration_fee || application.training_fee" class="mb-3">
        <div class="d-flex align-center justify-space-between">
          <span class="text-caption text-medium-emphasis">Frais d'inscription</span>
          <span class="text-body-2 font-weight-medium">{{ formatCurrency(application.registration_fee) }}</span>
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="text-caption text-medium-emphasis">Frais de formation</span>
          <span class="text-body-2 font-weight-medium">{{ formatCurrency(application.training_fee) }}</span>
        </div>
      </div>

      <!-- Date de création -->
      <div class="d-flex align-center justify-space-between text-caption text-medium-emphasis">
        <span>Créée le {{ formatDate(application.created_at) }}</span>
        <span v-if="application.payment_id" class="d-flex align-center">
          <VIcon size="small" class="mr-1" color="success">ri-check-line</VIcon>
          Payée
        </span>
      </div>

      <!-- Actions -->
      <VDivider class="my-3" />
      <div class="d-flex justify-space-between align-center">
        <!-- Actions principales -->
        <div class="d-flex gap-2">
          <!-- Pas d'actions principales pour le moment -->
        </div>

        <!-- Menu des actions -->
        <VMenu>
          <template #activator="{ props }">
            <VBtn
              size="small"
              variant="outlined"
              color="primary"
              v-bind="props"
              icon="ri-more-2-line"
            />
          </template>
          <VList density="compact">
            <VListItem @click="$emit('view', application.id)">
              <template #prepend>
                <VIcon size="small" color="primary">ri-eye-line</VIcon>
              </template>
              <VListItemTitle>Voir</VListItemTitle>
            </VListItem>


            <VListItem @click="$emit('delete', application.id)">
              <template #prepend>
                <VIcon size="small" color="error">ri-delete-bin-line</VIcon>
              </template>
              <VListItemTitle>Supprimer</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StudentApplicationOut } from '@/types/student-application'
import { ApplicationStatusEnum } from '@/types/student-application'
import { VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'

interface Props {
  application: StudentApplicationOut
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false
})

const emit = defineEmits<{
  view: [id: number]
  delete: [id: number]
}>()

// Computed properties
const statusChip = computed(() => {
  const statusConfig = {
    [ApplicationStatusEnum.SUBMITTED]: {
      text: 'Soumise',
      color: 'info',
      icon: 'ri-send-plane-line'
    },
    [ApplicationStatusEnum.APPROVED]: {
      text: 'Approuvée',
      color: 'success',
      icon: 'ri-check-line'
    },
    [ApplicationStatusEnum.REFUSED]: {
      text: 'Refusée',
      color: 'error',
      icon: 'ri-close-line'
    },
    [ApplicationStatusEnum.RECEIVED]: {
      text: 'Reçue',
      color: 'primary',
      icon: 'ri-inbox-line'
    }
  }

  return statusConfig[props.application.status as ApplicationStatusEnum] || {
    text: props.application.status,
    color: 'grey',
    icon: 'ri-question-line'
  }
})

const canDelete = computed(() => {
  return props.application.status === ApplicationStatusEnum.SUBMITTED
})




// Utility functions
const formatDate = (date: string | undefined) => {
  if (!date) return 'Non définie'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return 'Non défini'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<style scoped>
.student-application-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.student-application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.student-application-card.selected {
  border: 2px solid rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
