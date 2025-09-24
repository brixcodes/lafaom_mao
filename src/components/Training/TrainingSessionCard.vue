<script setup lang="ts">
import type { TrainingSession } from '@/types/training'
import { useSessionStatusBadgeColor } from '@/composables/useStatusBadgeColor'
import { formatDateForApi } from '@/utils/helpers'

interface Props {
  session: TrainingSession
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'register'): void
}>()

const formatDate = (date?: string) => {
  if (!date) return 'TBD'
  return formatDateForApi(new Date(date))
}
</script>

<template>
  <VCard class="session-card">
    <VCardItem>
      <VCardTitle>
        {{ session.training?.title || 'Training Session' }}
        <VChip
          :color="useSessionStatusBadgeColor(session.status)"
          size="small"
          class="ml-2"
        >
          {{ session.status.replace(/_/g, ' ') }}
        </VChip>
      </VCardTitle>

      <VCardSubtitle>
        Center: {{ session.center?.name || 'TBD' }}
      </VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol cols="12" sm="6">
          <div class="text-caption">Duration</div>
          <div class="text-body-2">
            {{ formatDate(session.start_date) }} - {{ formatDate(session.end_date) }}
          </div>
        </VCol>

        <VCol cols="12" sm="6">
          <div class="text-caption">Registration Deadline</div>
          <div class="text-body-2">{{ formatDate(session.registration_deadline) }}</div>
        </VCol>

        <VCol cols="12" sm="6">
          <div class="text-caption">Available Slots</div>
          <div class="text-body-2">{{ session.available_slots || 'Unlimited' }}</div>
        </VCol>

        <VCol cols="12" sm="6">
          <div class="text-caption">Fees</div>
          <div class="text-body-2">
            Registration: {{ session.registration_fee }} {{ session.currency }}<br>
            Training: {{ session.training_fee }} {{ session.currency }}
          </div>
        </VCol>
      </VRow>
    </VCardText>

    <VCardActions v-if="showActions">
      <VSpacer />
      <VBtn
        v-if="session.status === 'OPEN_FOR_REGISTRATION'"
        color="success"
        variant="tonal"
        @click="emit('register')"
      >
        Apply Now
      </VBtn>
      <VBtn
        v-if="showActions"
        color="primary"
        icon
        variant="text"
        @click="emit('edit')"
      >
        <VIcon>ri-pencil-line</VIcon>
      </VBtn>
      <VBtn
        v-if="showActions"
        color="error"
        icon
        variant="text"
        @click="emit('delete')"
      >
        <VIcon>ri-delete-bin-line</VIcon>
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<style scoped>
.session-card {
  transition: transform 0.2s ease-in-out;
}

.session-card:hover {
  transform: translateY(-4px);
}
</style>
