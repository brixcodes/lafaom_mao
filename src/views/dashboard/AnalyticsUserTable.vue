<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import { usersService } from '@/services/api/users'

const headers = [
  { title: 'Utilisateur', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Rôle', key: 'role' },
  { title: 'Statut', key: 'status' },
]

// Données réactives
const userData = ref([])
const loading = ref(true)

// Charger les utilisateurs
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await usersService.getUsers({ page_size: 8 })
    userData.value = response.data.map((user: any) => ({
      id: user.id,
      fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      role: user.roles?.[0]?.name || 'user',
      status: user.status || 'active',
      avatar: user.avatar || user.photo || user.picture || avatar1,
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
    // Données de fallback
    userData.value = [
      {
        id: 1,
        fullName: 'Admin LAFAOM',
        username: 'admin',
        email: 'admin@lafaom.com',
        role: 'admin',
        status: 'active',
        avatar: avatar1,
      },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const resolveUserRoleVariant = (role: string) => {
  const roleLowerCase = role.toLowerCase()

  if (roleLowerCase === 'student')
    return { color: 'success', icon: 'ri-user-line' }
  if (roleLowerCase === 'teacher')
    return { color: 'error', icon: 'ri-teacher-line' }
  if (roleLowerCase === 'admin')
    return { color: 'primary', icon: 'ri-vip-crown-line' }
  if (roleLowerCase === 'user')
    return { color: 'info', icon: 'ri-user-line' }

  return { color: 'success', icon: 'ri-user-line' }
}

const resolveUserStatusVariant = (stat: string) => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'

  return 'primary'
}
</script>

<template>
  <VCard>
    <VDataTable
      :headers="headers"
      :items="userData"
      item-value="id"
      class="text-no-wrap"
    >
      <!-- User -->
      <template #item.username="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar
            size="34"
            :variant="!item.avatar ? 'tonal' : undefined"
            :color="!item.avatar ? resolveUserRoleVariant(item.role).color : undefined"
          >
            <VImg
              v-if="item.avatar"
              :src="item.avatar"
            />
          </VAvatar>

          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.fullName }}
            </h6>

            <span class="text-sm text-medium-emphasis">@{{ item.username }}</span>
          </div>
        </div>
      </template>
      <!-- Role -->
      <template #item.role="{ item }">
        <div class="d-flex gap-4">
          <VIcon
            :icon="resolveUserRoleVariant(item.role).icon"
            :color="resolveUserRoleVariant(item.role).color"
            size="22"
          />
          <div class="text-capitalize text-high-emphasis">
            {{ item.role }}
          </div>
        </div>
      </template>
      <!-- Plan -->
      <template #item.plan="{ item }">
        <span class="text-capitalize text-high-emphasis">{{ item.currentPlan }}</span>
      </template>
      <!-- Status -->
      <template #item.status="{ item }">
        <VChip
          :color="resolveUserStatusVariant(item.status)"
          size="small"
          class="text-capitalize"
        >
          {{ item.status }}
        </VChip>
      </template>

      <template #bottom />
    </VDataTable>
  </VCard>
</template>
