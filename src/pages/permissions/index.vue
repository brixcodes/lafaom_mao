<template>
  <div>
    <h1 class="text-h4 mb-4">Gestion des permissions</h1>
    <VCard class="mb-4">
      <VCardText>
        <VAutocomplete
          v-model="selectedUserId"
          :items="userOptions"
          item-title="label"
          item-value="value"
          label="Sélectionner un utilisateur"
          clearable
          auto-select-first
          hide-details
          :return-object="false"
        />
      </VCardText>
    </VCard>
    <PermissionList />
    <UserPermissionManager v-if="selectedUserId" :user-id="selectedUserId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PermissionList from '@/components/Permission/PermissionList.vue'
import UserPermissionManager from '@/components/Permission/UserPermissionManager.vue'
import { userService } from '@/services/api/user'

const selectedUserId = ref<string>('')
const userOptions = ref<{ label: string; value: string }[]>([])

const fetchUsers = async () => {
  const res = await userService.getUsers()
  userOptions.value = (res.data || []).map(u => ({ label: `Utilisateur : --> ${u.last_name} ${u.first_name} `, value: u.id }))
}
onMounted(fetchUsers)
</script>

<style scoped>
/* Soft, modern style */
</style>
