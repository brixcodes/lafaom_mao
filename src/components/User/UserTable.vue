<template>
  <VDataTable
    :headers="headers"
    :items="users"
    :loading="isLoading"
    class="elevation-0"
    item-value="id"
  >
    <template #item.picture="{ item }">
      <VAvatar :image="item.picture" :color="item.picture ? undefined : 'primary'" size="40">
        <span v-if="!item.picture" class="text-white">
          {{ getUserInitials(item) }}
        </span>
      </VAvatar>
    </template>
    <template #item.full_name="{ item }">
      <div>
        <div class="font-weight-medium">{{ item.first_name }} {{ item.last_name }}</div>
        <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
      </div>
    </template>
    <template #item.status="{ item }">
      <VChip :color="getStatusColor(item.status)" size="small" variant="tonal">
        {{ getStatusText(item.status) }}
      </VChip>
    </template>
    <template #item.user_type="{ item }">
      <VChip :color="getUserTypeColor(item.user_type)" size="small" variant="tonal">
        {{ getUserTypeText(item.user_type) }}
      </VChip>
    </template>
    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex gap-2">
        <VBtn icon="ri-eye-line" size="small" variant="text" @click="$emit('detail', item.id)" />
        <VBtn icon="ri-edit-line" size="small" variant="text" @click="$emit('edit', item.id)" />
        <VBtn icon="ri-delete-bin-line" size="small" variant="text" color="error" @click="$emit('delete', item)" />
      </div>
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { UserSimpleOut, UserTypeEnum, UserStatusEnum } from '@/types/user'
import { Formatter } from '@/utils'

const props = defineProps<{
  users: UserSimpleOut[]
  headers: any[]
  isLoading: boolean
}>()
const emit = defineEmits(['detail', 'edit', 'delete'])

const getUserInitials = (user: UserSimpleOut) => `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
const getStatusColor = (status: UserStatusEnum) => {
  switch (status) {
    case 'ACTIVE': return 'success'
    case 'INACTIVE': return 'warning'
    case 'SUSPENDED': return 'error'
    default: return 'default'
  }
}
const getStatusText = (status: UserStatusEnum) => {
  switch (status) {
    case 'ACTIVE': return 'Actif'
    case 'INACTIVE': return 'Inactif'
    case 'SUSPENDED': return 'Suspendu'
    default: return status
  }
}
const getUserTypeColor = (userType: UserTypeEnum) => {
  switch (userType) {
    case 'admin': return 'error'
    case 'staff': return 'warning'
    case 'student': return 'info'
    default: return 'default'
  }
}
const getUserTypeText = (userType: UserTypeEnum) => {
  switch (userType) {
    case 'admin': return 'Admin'
    case 'staff': return 'Staff'
    case 'student': return 'Étudiant'
    default: return userType
  }
}
const formatDate = (date: string) => Formatter.formatDate(date)
</script>
