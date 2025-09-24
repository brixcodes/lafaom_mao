<template>
  <VCard elevation="2" class="pa-6 user-detail-soft">
    <VRow align="center" class="mb-4">
      <VCol cols="auto">
        <VAvatar size="72" color="primary">
          <VIcon icon="ri-user-line" size="40" color="white" />
        </VAvatar>
      </VCol>
      <VCol>
        <div class="text-h5 font-weight-bold mb-1">{{ user.first_name }} {{ user.last_name }}</div>
        <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
      </VCol>
    </VRow>
    <VDivider class="mb-4" />
    <VRow>
      <VCol cols="12" md="6">
        <div class="mb-2">
          <span class="font-weight-medium">Téléphone :</span>
          <span class="ml-2">{{ user.mobile_number || '-' }}</span>
        </div>
        <div class="mb-2">
          <span class="font-weight-medium">Type utilisateur :</span>
          <span class="ml-2 text-capitalize">{{ user.user_type }}</span>
        </div>
        <div class="mb-2">
          <span class="font-weight-medium">Statut du compte :</span>
          <VChip :color="user.status === 'active' ? 'success' : 'error'" class="ml-2" size="small" text-color="white">
            {{ user.status }}
          </VChip>
        </div>
      </VCol>
      <VCol cols="12" md="6">
        <div class="mb-2">
          <span class="font-weight-medium">Créé le :</span>
          <span class="ml-2">{{ formatDate(user.created_at) }}</span>
        </div>
        <div class="mb-2">
          <span class="font-weight-medium">Langue :</span>
          <span class="ml-2 text-capitalize">{{ user.lang || '-' }}</span>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup lang="ts">
import { Formatter } from '@/utils'
const props = defineProps({ user: Object })
const formatDate = (date: string) => Formatter.formatDate(date)
</script>
<style scoped>
.user-detail-soft {
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(60, 60, 60, 0.06);
}
.font-weight-medium {
  font-weight: 500;
}
.text-capitalize {
  text-transform: capitalize;
}
</style>
