<template>
  <div>
    <h1 class="text-h4 mb-4">Gestion des permissions et rôles</h1>
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
    
    <!-- Composant de debug pour tester les API -->
    <div class="mb-6">
      <PermissionDebugger />
    </div>
    
    <!-- Gestion des permissions et rôles pour l'utilisateur sélectionné -->
    <div v-if="selectedUserId">
      <UserPermissionManager :user-id="selectedUserId" />
      <UserRoleManager :user-id="selectedUserId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PermissionList from '@/components/Permission/PermissionList.vue'
import UserPermissionManager from '@/components/Permission/UserPermissionManager.vue'
import UserRoleManager from '@/components/Permission/UserRoleManager.vue'
import PermissionDebugger from '@/components/Permission/PermissionDebugger.vue'
import { usersService } from '@/services/api/users'

const selectedUserId = ref<string>('')
const userOptions = ref<{ label: string; value: string }[]>([])

const fetchUsers = async () => {
  const res = await usersService.getUsers()
  userOptions.value = (res.data || []).map(u => ({ label: `Utilisateur : --> ${u.last_name} ${u.first_name} `, value: u.id }))
}
onMounted(fetchUsers)
</script>

<style scoped>
/* Soft, modern style */
</style>
